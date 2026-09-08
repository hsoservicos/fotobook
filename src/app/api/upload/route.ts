import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/heif",
];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function generateFilename(originalName: string): string {
  const ext = originalName.split(".").pop()?.toLowerCase() || "jpg";
  return `${randomUUID()}.${ext}`;
}

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(0, 100);
}

function validateImageMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 4) return false;

  const signatures: Record<string, number[][]> = {
    "image/jpeg": [[0xff, 0xd8, 0xff]],
    "image/png": [[0x89, 0x50, 0x4e, 0x47]],
    "image/gif": [[0x47, 0x49, 0x46, 0x38]],
    "image/webp": [[0x52, 0x49, 0x46, 0x46]],
  };

  const expected = signatures[mimeType];
  if (!expected) return true; // HEIC/HEIF — skip validation

  return expected.some((sig) =>
    sig.every((byte, i) => buffer[i] === byte)
  );
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const formData = await request.formData();
    const photo = formData.get("photo") as File;
    const description = (formData.get("description") as string) || "";
    const tagsString = (formData.get("tags") as string) || "";
    const isPublic = formData.get("isPublic") !== "false";
    const albumId = (formData.get("albumId") as string) || undefined;

    if (!photo) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(photo.type)) {
      return NextResponse.json(
        {
          error:
            "Tipo de arquivo não permitido. Formatos aceitos: JPG, PNG, GIF, WEBP, HEIC.",
        },
        { status: 400 }
      );
    }

    if (photo.size > MAX_SIZE) {
      return NextResponse.json(
        {
          error: `Arquivo muito grande (${(photo.size / 1024 / 1024).toFixed(1)}MB). Tamanho máximo: 10MB.`,
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await photo.arrayBuffer());
    if (!validateImageMagicBytes(buffer, photo.type)) {
      return NextResponse.json(
        { error: "O arquivo não é uma imagem válida." },
        { status: 400 }
      );
    }

    const filename = generateFilename(photo.name);
    const url = await storage.save(user.userId, filename, buffer);

    const tags = tagsString
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0 && t.length <= 50)
      .slice(0, 20);

    const photoRecord = await db.photo.create({
      data: {
        userId: user.userId,
        filename,
        originalName: sanitizeFilename(photo.name),
        description: description.trim().slice(0, 500),
        tags,
        size: photo.size,
        mimeType: photo.type,
        isPublic,
        albumId: albumId || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Foto enviada com sucesso!",
      photo: { ...photoRecord, url },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor. Tente novamente." },
      { status: 500 }
    );
  }
}
