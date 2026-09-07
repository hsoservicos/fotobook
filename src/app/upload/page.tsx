"use client";

import { useState, useRef, useCallback } from "react";

interface QueuedPhoto {
  id: string;
  file: File;
  preview: string;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
  description: string;
  tags: string;
}

export default function UploadPage() {
  const [photos, setPhotos] = useState<QueuedPhoto[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const validateFile = (file: File): string | null => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/heic",
      "image/heif",
    ];
    if (!allowedTypes.includes(file.type)) {
      return "Tipo não permitido. Use JPG, PNG, GIF ou WEBP.";
    }
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return `Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Máximo: 10MB.`;
    }
    return null;
  };

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      setGlobalError(null);
      const newPhotos: QueuedPhoto[] = [];
      const errors: string[] = [];

      Array.from(files).forEach((file) => {
        const error = validateFile(file);
        if (error) {
          errors.push(`${file.name}: ${error}`);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          newPhotos.push({
            id: generateId(),
            file,
            preview: e.target?.result as string,
            status: "pending",
            progress: 0,
            description: "",
            tags: "",
          });
          // Evitar duplicatas
          setPhotos((prev) => {
            const existingIds = new Set(prev.map((p) => p.file.name));
            const filtered = newPhotos.filter(
              (p) => !existingIds.has(p.file.name)
            );
            return [...prev, ...filtered];
          });
        };
        reader.readAsDataURL(file);
      });

      if (errors.length > 0) {
        setGlobalError(errors.join("\n"));
      }
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = "";
    }
  };

  const updatePhoto = (id: string, updates: Partial<QueuedPhoto>) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo) URL.revokeObjectURL(photo.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  const clearAll = () => {
    photos.forEach((p) => URL.revokeObjectURL(p.preview));
    setPhotos([]);
    setGlobalError(null);
  };

  const uploadSinglePhoto = async (photo: QueuedPhoto): Promise<boolean> => {
    updatePhoto(photo.id, { status: "uploading", progress: 0 });

    try {
      const formData = new FormData();
      formData.append("photo", photo.file);
      formData.append("description", photo.description);
      formData.append("tags", photo.tags);

      const xhr = new XMLHttpRequest();

      const success = await new Promise<boolean>((resolve) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            updatePhoto(photo.id, { progress: percent });
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            updatePhoto(photo.id, { status: "success", progress: 100 });
            resolve(true);
          } else {
            let errorMsg = "Erro no upload.";
            try {
              const response = JSON.parse(xhr.responseText);
              errorMsg = response.error || errorMsg;
            } catch {
              // Use default error message
            }
            updatePhoto(photo.id, { status: "error", error: errorMsg });
            resolve(false);
          }
        });

        xhr.addEventListener("error", () => {
          updatePhoto(photo.id, {
            status: "error",
            error: "Erro de conexão.",
          });
          resolve(false);
        });

        xhr.open("POST", "/api/upload");
        xhr.send(formData);
      });

      return success;
    } catch {
      updatePhoto(photo.id, {
        status: "error",
        error: "Erro inesperado.",
      });
      return false;
    }
  };

  const handleUploadAll = async () => {
    const pendingPhotos = photos.filter((p) => p.status === "pending");
    if (pendingPhotos.length === 0) {
      setGlobalError("Nenhuma foto pendente para enviar.");
      return;
    }

    setIsUploading(true);
    let successCount = 0;

    for (const photo of pendingPhotos) {
      const success = await uploadSinglePhoto(photo);
      if (success) successCount++;
    }

    setIsUploading(false);

    if (successCount > 0) {
      // Remover fotos com sucesso após 2 segundos
      setTimeout(() => {
        setPhotos((prev) => {
          const remaining = prev.filter((p) => p.status !== "success");
          return remaining;
        });
      }, 2000);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const pendingCount = photos.filter((p) => p.status === "pending").length;
  const successCount = photos.filter((p) => p.status === "success").length;
  const errorCount = photos.filter((p) => p.status === "error").length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Enviar Fotos 📤
        </h2>
        <p className="text-gray-600">
          Arraste e solte ou selecione suas fotos. Suporta múltiplos arquivos
          de uma vez.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
          ${
            isDragging
              ? "border-blue-500 bg-blue-50 scale-[1.02]"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="space-y-3">
          <div className="text-5xl">{isDragging ? "📥" : "📷"}</div>
          <div>
            <p className="text-lg font-semibold text-gray-700">
              {isDragging
                ? "Solte suas fotos aqui!"
                : "Arraste fotos aqui ou clique para selecionar"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              JPG, PNG, GIF, WEBP • Até 10MB cada • Múltiplos arquivos
            </p>
          </div>
        </div>
      </div>

      {/* Global Error */}
      {globalError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm whitespace-pre-line">
            {globalError}
          </p>
          <button
            onClick={() => setGlobalError(null)}
            className="text-red-500 text-sm underline mt-1"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Photo Queue */}
      {photos.length > 0 && (
        <div className="space-y-4">
          {/* Stats Bar */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-600">
                <strong>{photos.length}</strong> foto{photos.length !== 1 ? "s" : ""}
              </span>
              {pendingCount > 0 && (
                <span className="text-blue-600">
                  {pendingCount} pendente{pendingCount !== 1 ? "s" : ""}
                </span>
              )}
              {successCount > 0 && (
                <span className="text-green-600">
                  ✓ {successCount} enviada{successCount !== 1 ? "s" : ""}
                </span>
              )}
              {errorCount > 0 && (
                <span className="text-red-600">
                  ✗ {errorCount} erro{errorCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <button
              onClick={clearAll}
              className="text-sm text-gray-500 hover:text-red-500"
            >
              Limpar tudo
            </button>
          </div>

          {/* Photo Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 ${
                  photo.status === "success"
                    ? "border-green-200 bg-green-50"
                    : photo.status === "error"
                      ? "border-red-200 bg-red-50"
                      : "border-gray-200"
                }`}
              >
                <div className="flex gap-3 p-3">
                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.preview}
                      alt={photo.file.name}
                      className="w-full h-full object-cover"
                    />
                    {photo.status === "uploading" && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-white text-sm font-medium">
                          {photo.progress}%
                        </div>
                      </div>
                    )}
                    {photo.status === "success" && (
                      <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
                        <span className="text-white text-2xl">✓</span>
                      </div>
                    )}
                    {photo.status === "error" && (
                      <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
                        <span className="text-white text-2xl">✗</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p
                        className="text-sm font-medium text-gray-900 truncate"
                        title={photo.file.name}
                      >
                        {photo.file.name}
                      </p>
                      {photo.status === "pending" && (
                        <button
                          onClick={() => removePhoto(photo.id)}
                          className="text-gray-400 hover:text-red-500 ml-2 flex-shrink-0"
                          title="Remover"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(photo.file.size)}
                    </p>

                    {/* Progress Bar */}
                    {photo.status === "uploading" && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${photo.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Error Message */}
                    {photo.status === "error" && photo.error && (
                      <p className="text-xs text-red-600 mt-1">{photo.error}</p>
                    )}

                    {/* Success Message */}
                    {photo.status === "success" && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ Enviada com sucesso!
                      </p>
                    )}
                  </div>
                </div>

                {/* Metadata Fields (only for pending photos) */}
                {photo.status === "pending" && (
                  <div className="px-3 pb-3 space-y-2 border-t border-gray-100">
                    <div className="pt-2">
                      <input
                        type="text"
                        placeholder="Descrição (opcional)"
                        value={photo.description}
                        onChange={(e) =>
                          updatePhoto(photo.id, {
                            description: e.target.value,
                          })
                        }
                        className="w-full text-sm border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Tags (separadas por vírgula)"
                        value={photo.tags}
                        onChange={(e) =>
                          updatePhoto(photo.id, { tags: e.target.value })
                        }
                        className="w-full text-sm border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <div className="flex gap-3">
            <button
              onClick={handleUploadAll}
              disabled={pendingCount === 0 || isUploading}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <span className="animate-spin">⟳</span>
                  Enviando...
                </>
              ) : (
                <>
                  📤 Enviar {pendingCount > 0 ? `${pendingCount} ` : ""}Foto
                  {pendingCount !== 1 ? "s" : ""}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
