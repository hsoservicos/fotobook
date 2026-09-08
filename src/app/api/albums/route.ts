import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

// GET — List albums
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const albums = await db.album.findMany({
      where: { userId: user.userId },
      include: { photos: { select: { id: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      albums: albums.map((a) => ({
        ...a,
        photoCount: a.photos.length,
        photos: undefined,
      })),
    });
  } catch (error) {
    console.error("List albums error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}

// POST — Create album
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const { name, description } = await request.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Nome do álbum é obrigatório." },
        { status: 400 }
      );
    }

    const album = await db.album.create({
      data: {
        userId: user.userId,
        name: name.trim().slice(0, 100),
        description: (description || "").trim().slice(0, 500),
      },
    });

    return NextResponse.json({ album }, { status: 201 });
  } catch (error) {
    console.error("Create album error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}

// PUT — Update album
export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const { id, name, description, coverPhotoId } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID do álbum é obrigatório." },
        { status: 400 }
      );
    }

    const album = await db.album.findFirst({
      where: { id, userId: user.userId },
    });

    if (!album) {
      return NextResponse.json(
        { error: "Álbum não encontrado." },
        { status: 404 }
      );
    }

    const updated = await db.album.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim().slice(0, 100) }),
        ...(description !== undefined && {
          description: description.trim().slice(0, 500),
        }),
        ...(coverPhotoId !== undefined && { coverPhotoId }),
      },
    });

    return NextResponse.json({ album: updated });
  } catch (error) {
    console.error("Update album error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}

// DELETE — Delete album
export async function DELETE(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID do álbum é obrigatório." },
        { status: 400 }
      );
    }

    const album = await db.album.findFirst({
      where: { id, userId: user.userId },
    });

    if (!album) {
      return NextResponse.json(
        { error: "Álbum não encontrado." },
        { status: 404 }
      );
    }

    // Unlink photos from album before deleting
    await db.photo.updateMany({
      where: { albumId: id },
      data: { albumId: null },
    });

    await db.album.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete album error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
