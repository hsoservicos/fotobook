"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Photo {
  id: string;
  filename: string;
  originalName: string;
  description: string;
  tags: string[];
  uploadedAt: string;
  size: number;
  mimeType: string;
  url: string;
  width?: number;
  height?: number;
}

type SortOption = "newest" | "oldest" | "name" | "size";
type ViewMode = "grid" | "masonry" | "list";

export default function GaleriaPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const saved = localStorage.getItem("auth");
      const token = saved ? JSON.parse(saved).token : "";
      const response = await fetch("/api/photos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (response.ok) {
        setPhotos(result.photos || []);
      } else {
        setError(result.error || "Erro ao carregar fotos.");
      }
    } catch {
      setError("Erro de conexão ao carregar fotos.");
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll observer
  const lastPhotoRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + 12);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading]
  );

  // Get all unique tags
  const allTags = Array.from(new Set(photos.flatMap((p) => p.tags)));

  // Filter and sort photos
  const filteredPhotos = photos
    .filter((photo) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          photo.description.toLowerCase().includes(query) ||
          photo.originalName.toLowerCase().includes(query) ||
          photo.tags.some((t) => t.toLowerCase().includes(query))
        );
      }
      if (selectedTag) {
        return photo.tags.includes(selectedTag);
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.uploadedAt).getTime() -
            new Date(a.uploadedAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.uploadedAt).getTime() -
            new Date(b.uploadedAt).getTime()
          );
        case "name":
          return a.originalName.localeCompare(b.originalName);
        case "size":
          return b.size - a.size;
        default:
          return 0;
      }
    });

  const visiblePhotos = filteredPhotos.slice(0, visibleCount);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selectedPhoto) return;

      const currentIndex = filteredPhotos.findIndex(
        (p) => p.id === selectedPhoto.id
      );

      if (e.key === "Escape") {
        setSelectedPhoto(null);
      } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        setSelectedPhoto(filteredPhotos[currentIndex - 1]);
      } else if (
        e.key === "ArrowRight" &&
        currentIndex < filteredPhotos.length - 1
      ) {
        setSelectedPhoto(filteredPhotos[currentIndex + 1]);
      }
    },
    [selectedPhoto, filteredPhotos]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Minha Galeria 🖼️
          </h2>
        </div>
        {/* Skeleton Loading */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">❌</div>
        <p className="text-red-600 text-lg">{error}</p>
        <button
          onClick={fetchPhotos}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Minha Galeria 🖼️
        </h2>
        <p className="text-gray-600">
          {filteredPhotos.length} foto{filteredPhotos.length !== 1 ? "s" : ""}
          {searchQuery || selectedTag ? " encontrada" : " registrada"}
          {filteredPhotos.length !== 1 ? "s" : ""}
        </p>
      </div>

      {photos.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
          <div className="text-7xl mb-6">📷</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">
            Sua galeria está vazia
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Comece enviando suas primeiras fotos. Elas aparecerão aqui
            automaticamente!
          </p>
          <a
            href="/upload"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            📤 Enviar Primeiras Fotos
          </a>
        </div>
      ) : (
        <>
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-gray-200">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="🔍 Buscar fotos..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedTag(null);
                }}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Mais recentes</option>
              <option value="oldest">Mais antigas</option>
              <option value="name">Nome</option>
              <option value="size">Tamanho</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 text-sm ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                title="Grade"
              >
                ⊞
              </button>
              <button
                onClick={() => setViewMode("masonry")}
                className={`px-3 py-2 text-sm ${
                  viewMode === "masonry"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                title="Masonry"
              >
                ⊟
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 text-sm ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                title="Lista"
              >
                ☰
              </button>
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  !selectedTag
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Todas
              </button>
              {allTags.slice(0, 15).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    selectedTag === tag
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {/* Photo Grid */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {visiblePhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  ref={index === visiblePhotos.length - 1 ? lastPhotoRef : null}
                  className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.description || photo.originalName}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-medium truncate">
                        {photo.description || photo.originalName}
                      </p>
                      <p className="text-white/70 text-xs mt-1">
                        {formatDate(photo.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  {/* Tags Badge */}
                  {photo.tags.length > 0 && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                        {photo.tags.length} tag{photo.tags.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {viewMode === "masonry" && (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
              {visiblePhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  ref={index === visiblePhotos.length - 1 ? lastPhotoRef : null}
                  className="group relative overflow-hidden rounded-xl cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 break-inside-avoid"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.description || photo.originalName}
                    loading="lazy"
                    className="w-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-medium truncate">
                        {photo.description || photo.originalName}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === "list" && (
            <div className="space-y-2">
              {visiblePhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  ref={index === visiblePhotos.length - 1 ? lastPhotoRef : null}
                  className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.description || photo.originalName}
                    loading="lazy"
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {photo.description || photo.originalName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(photo.uploadedAt)} • {formatSize(photo.size)}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {photo.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Indicator */}
          {visibleCount < filteredPhotos.length && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 text-gray-500">
                <span className="animate-spin">⟳</span>
                Carregando mais fotos...
              </div>
            </div>
          )}
        </>
      )}

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl z-10"
          >
            ✕
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const currentIndex = filteredPhotos.findIndex(
                (p) => p.id === selectedPhoto.id
              );
              if (currentIndex > 0) {
                setSelectedPhoto(filteredPhotos[currentIndex - 1]);
              }
            }}
            className="absolute left-4 text-white/70 hover:text-white text-4xl z-10 disabled:opacity-30"
            disabled={
              filteredPhotos.findIndex((p) => p.id === selectedPhoto.id) === 0
            }
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const currentIndex = filteredPhotos.findIndex(
                (p) => p.id === selectedPhoto.id
              );
              if (currentIndex < filteredPhotos.length - 1) {
                setSelectedPhoto(filteredPhotos[currentIndex + 1]);
              }
            }}
            className="absolute right-4 text-white/70 hover:text-white text-4xl z-10 disabled:opacity-30"
            disabled={
              filteredPhotos.findIndex((p) => p.id === selectedPhoto.id) ===
              filteredPhotos.length - 1
            }
          >
            ›
          </button>

          {/* Photo Container */}
          <div
            className="flex flex-col lg:flex-row max-w-6xl max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="flex-1 flex items-center justify-center min-h-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.description || selectedPhoto.originalName}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>

            {/* Info Panel */}
            <div className="lg:w-80 bg-gray-900 text-white p-4 rounded-b-lg lg:rounded-r-lg lg:rounded-bl-none mt-2 lg:mt-0 lg:ml-2 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">
                {selectedPhoto.description || selectedPhoto.originalName}
              </h3>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Arquivo:</span>
                  <p className="text-white truncate">
                    {selectedPhoto.originalName}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Data:</span>
                  <p className="text-white">{formatDate(selectedPhoto.uploadedAt)}</p>
                </div>
                <div>
                  <span className="text-gray-400">Tamanho:</span>
                  <p className="text-white">{formatSize(selectedPhoto.size)}</p>
                </div>
                {selectedPhoto.width && selectedPhoto.height && (
                  <div>
                    <span className="text-gray-400">Dimensões:</span>
                    <p className="text-white">
                      {selectedPhoto.width} × {selectedPhoto.height}
                    </p>
                  </div>
                )}
                {selectedPhoto.tags.length > 0 && (
                  <div>
                    <span className="text-gray-400">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedPhoto.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-2">
                <a
                  href={selectedPhoto.url}
                  download
                  className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  📥 Download
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      window.location.origin + selectedPhoto.url
                    );
                  }}
                  className="block w-full text-center bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  🔗 Copiar Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
