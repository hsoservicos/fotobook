import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { AuthHeader } from "@/components/AuthHeader";

export const metadata: Metadata = {
  title: "FotoBook - Registro de Fotos Pessoais",
  description:
    "Aplicação web para registro e upload de fotos pessoais de forma simples e direta",
  authors: [{ name: "Humberto Santos" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <AuthHeader />
            <main className="flex-1">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </div>
            </main>
            <footer className="bg-gray-50 border-t">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <p className="text-center text-sm text-gray-500">
                  FotoBook © 2026 — Desenvolvido por{" "}
                  <span className="font-medium">Humberto Santos</span> para{" "}
                  <span className="font-medium">Vânia Rodrigues</span>
                </p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
