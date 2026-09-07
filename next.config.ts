import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração de upload de imagens
  images: {
    remotePatterns: [
      // Adicionar patterns de URLs externas se necessário no futuro
    ],
  },

  // Configuração de output para Coolify
  output: "standalone",

  // Configurações experimentais
  experimental: {
    // Habilitar server actions para upload
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
