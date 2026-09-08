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
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10) || 50));
    const albumId = searchParams.get("albumId");

    const where: Record<string, unknown> = { userId: user.userId };
    if (albumId) where.albumId = albumId;

    // Fetch all matching photos for client-side filtering (acceptable for < 1000 photos)
    const allPhotos = await db.photo.findMany({
      where,
      orderBy:
        sortBy === "oldest"
          ? { uploadedAt: "asc" }
          : sortBy === "name"
            ? { originalName: "asc" }
            : sortBy === "size"
              ? { size: "desc" }
              : { uploadedAt: "desc" },
    });

    // Apply client-side filters for search/tag
    let filtered = allPhotos;
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

    // Paginate filtered results
    const total = filtered.length;
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      photos: paginated.map((p) => ({
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
