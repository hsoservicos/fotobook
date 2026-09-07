import { NextRequest, NextResponse } from "next/server";
import { readdir, readFile } from "fs/promises";
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

const METADATA_DIR = path.join(process.cwd(), "public", "uploads", "metadata");

export async function GET(request: NextRequest) {
  try {
    if (!existsSync(METADATA_DIR)) {
      return NextResponse.json({ photos: [], total: 0 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q")?.toLowerCase();
    const tag = searchParams.get("tag")?.toLowerCase();
    const sortBy = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const files = await readdir(METADATA_DIR);
    const metadataFiles = files.filter((file) => file.endsWith(".json"));

    const photos: (PhotoMetadata & { url: string })[] = [];

    for (const file of metadataFiles) {
      try {
        const filePath = path.join(METADATA_DIR, file);
        const content = await readFile(filePath, "utf-8");
        const metadata: PhotoMetadata = JSON.parse(content);

        // Verificar se o arquivo de imagem existe
        const imagePath = path.join(
          process.cwd(),
          "public",
          "uploads",
          metadata.filename
        );

        if (!existsSync(imagePath)) continue;

        // Filtro por busca
        if (search) {
          const matchesSearch =
            metadata.description.toLowerCase().includes(search) ||
            metadata.originalName.toLowerCase().includes(search) ||
            metadata.tags.some((t) => t.toLowerCase().includes(search));
          if (!matchesSearch) continue;
        }

        // Filtro por tag
        if (tag) {
          const matchesTag = metadata.tags.some((t) =>
            t.toLowerCase().includes(tag)
          );
          if (!matchesTag) continue;
        }

        photos.push({
          ...metadata,
          url: `/uploads/${metadata.filename}`,
        });
      } catch {
        // Ignorar arquivos de metadados corrompidos
        continue;
      }
    }

    // Ordenação
    photos.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.uploadedAt).getTime() -
            new Date(b.uploadedAt).getTime()
          );
        case "name":
          return a.originalName.localeCompare(b.originalName);
        case "size":
          return b.size - a.size;
        case "newest":
        default:
          return (
            new Date(b.uploadedAt).getTime() -
            new Date(a.uploadedAt).getTime()
          );
      }
    });

    const total = photos.length;

    // Paginação
    const offset = (page - 1) * limit;
    const paginatedPhotos = photos.slice(offset, offset + limit);

    return NextResponse.json({
      photos: paginatedPhotos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Erro ao listar fotos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
