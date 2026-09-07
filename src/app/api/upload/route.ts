import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

interface PhotoMetadata {
  id: string;
  filename: string;
  originalName: string;
  description: string;
  tags: string[];
  uploadedAt: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  isPublic: boolean;
  isFavorite: boolean;
}

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const METADATA_DIR = path.join(process.cwd(), "public", "uploads", "metadata");

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/heif",
];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

async function ensureDirectories() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
  if (!existsSync(METADATA_DIR)) {
    await mkdir(METADATA_DIR, { recursive: true });
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function getMetadataPath(id: string): string {
  return path.join(METADATA_DIR, `${id}.json`);
}

export async function POST(request: NextRequest) {
  try {
    await ensureDirectories();

    const formData = await request.formData();
    const photo = formData.get("photo") as File;
    const description = (formData.get("description") as string) || "";
    const tagsString = (formData.get("tags") as string) || "";
    const isPublic = formData.get("isPublic") !== "false";
    const albumId = (formData.get("albumId") as string) || undefined;

    // Validação do arquivo
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

    // Validação de conteúdo (verificar magic bytes)
    const buffer = Buffer.from(await photo.arrayBuffer());
    const isValidImage = validateImageMagicBytes(buffer, photo.type);
    if (!isValidImage) {
      return NextResponse.json(
        { error: "O arquivo não é uma imagem válida." },
        { status: 400 }
      );
    }

    // Gerar ID único e nome de arquivo seguro
    const id = generateId();
    const ext = getExtensionFromMime(photo.type) || "jpg";
    const filename = `${id}.${ext}`;

    // Salvar arquivo
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);

    // Processar tags (limpar e normalizar)
    const tags = tagsString
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0 && tag.length <= 50)
      .slice(0, 20); // Máximo 20 tags

    // Criar metadados
    const metadata: PhotoMetadata = {
      id,
      filename,
      originalName: sanitizeFilename(photo.name),
      description: description.trim().slice(0, 500), // Máximo 500 caracteres
      tags,
      uploadedAt: new Date().toISOString(),
      size: photo.size,
      mimeType: photo.type,
      isPublic,
      isFavorite: false,
    };

    if (albumId) {
      (metadata as Record<string, unknown>).albumId = albumId;
    }

    // Salvar metadados
    await writeFile(getMetadataPath(id), JSON.stringify(metadata, null, 2));

    return NextResponse.json({
      success: true,
      message: "Foto enviada com sucesso!",
      photo: {
        id,
        filename,
        url: `/uploads/${filename}`,
        description: metadata.description,
        tags: metadata.tags,
        uploadedAt: metadata.uploadedAt,
        size: metadata.size,
        mimeType: metadata.mimeType,
      },
    });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor. Tente novamente." },
      { status: 500 }
    );
  }
}

// Funções auxiliares

function validateImageMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 4) return false;

  const signatures: Record<string, number[][]> = {
    "image/jpeg": [[0xff, 0xd8, 0xff]],
    "image/png": [
      [0x89, 0x50, 0x4e, 0x47], // PNG
    ],
    "image/gif": [
      [0x47, 0x49, 0x46, 0x38], // GIF87a or GIF89a
    ],
    "image/webp": [
      [0x52, 0x49, 0x46, 0x46], // RIFF (WEBP starts with RIFF)
    ],
  };

  const expectedSignatures = signatures[mimeType];
  if (!expectedSignatures) return true; // HEIC/HEIF - não validar por magic bytes

  return expectedSignatures.some((signature) =>
    signature.every((byte, index) => buffer[index] === byte)
  );
}

function getExtensionFromMime(mimeType: string): string | null {
  const mimeToExt: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/heic": "heic",
    "image/heif": "heif",
  };
  return mimeToExt[mimeType] || null;
}

function sanitizeFilename(filename: string): string {
  // Remover caracteres perigosos e limitar tamanho
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(0, 100);
}
