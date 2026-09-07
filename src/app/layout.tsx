import type { Metadata } from "next";
import "./globals.css";

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
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-blue-600">📷 FotoBook</h1>
                </div>
                <nav className="flex space-x-4">
                  <a
                    href="/"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Início
                  </a>
                  <a
                    href="/upload"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Upload
                  </a>
                  <a
                    href="/galeria"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Galeria
                  </a>
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>

          {/* Footer */}
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
      </body>
    </html>
  );
}
