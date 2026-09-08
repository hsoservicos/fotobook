import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q")?.toLowerCase();
    const tag = searchParams.get("tag")?.toLowerCase();
    const sortBy = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const albumId = searchParams.get("albumId");

    const where: Record<string, unknown> = { userId: user.userId };
    if (albumId) where.albumId = albumId;

    const photos = await db.photo.findMany({
      where,
      orderBy:
        sortBy === "oldest"
          ? { uploadedAt: "asc" }
          : sortBy === "name"
            ? { originalName: "asc" }
            : sortBy === "size"
              ? { size: "desc" }
              : { uploadedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Apply client-side filters for search/tag since Prisma doesn't do full-text on arrays easily
    let filtered = photos;
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.description.toLowerCase().includes(search) ||
          p.originalName.toLowerCase().includes(search) ||
          p.tags.some((t) => t.toLowerCase().includes(search))
      );
    }
    if (tag) {
      filtered = filtered.filter((p) =>
        p.tags.some((t) => t.toLowerCase().includes(tag))
      );
    }

    const total = await db.photo.count({ where });

    return NextResponse.json({
      photos: filtered.map((p) => ({
        ...p,
        url: `/uploads/${p.userId}/${p.filename}`,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("List photos error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
