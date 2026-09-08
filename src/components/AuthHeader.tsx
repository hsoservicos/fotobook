"use client";

import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";

export function AuthHeader() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-blue-600">
              📷 FotoBook
            </a>
          </div>
          <nav className="flex items-center space-x-4">
            {isLoading ? (
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
            ) : user ? (
              <>
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
                <span className="text-gray-400">|</span>
                <span className="text-sm text-gray-500">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Entrar
                </a>
                <a
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Criar Conta
                </a>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
