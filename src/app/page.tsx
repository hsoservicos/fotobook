export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-6xl mb-6">📸</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Olá, <span className="text-blue-600">Vânia</span>! 👋
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Seu espaço pessoal para registrar e organizar suas fotos favoritas.
            Upload simples e direto — sem complicação.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/upload"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5"
            >
              <span className="text-xl">📤</span>
              Enviar Fotos
            </a>
            <a
              href="/galeria"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              <span className="text-xl">🖼️</span>
              Ver Galeria
            </a>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
          <div className="text-3xl mb-3">📤</div>
          <h3 className="text-2xl font-bold text-gray-900">Upload Fácil</h3>
          <p className="text-gray-500 mt-2">
            Arraste e solte ou clique. Suporta múltiplos arquivos de uma vez.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
          <div className="text-3xl mb-3">🏷️</div>
          <h3 className="text-2xl font-bold text-gray-900">Organize</h3>
          <p className="text-gray-500 mt-2">
            Adicione descrições, tags e organize em albums.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
          <div className="text-3xl mb-3">🔍</div>
          <h3 className="text-2xl font-bold text-gray-900">Encontre</h3>
          <p className="text-gray-500 mt-2">
            Busca inteligente por data, tags ou descrição.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
          Como funciona?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Selecione suas fotos
            </h3>
            <p className="text-gray-600">
              Clique em &quot;Enviar Fotos&quot; e escolha do computador ou arraste
              diretamente.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Adicione detalhes
            </h3>
            <p className="text-gray-600">
              Escreva uma descrição e adicione tags para organizar.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Acesse sua galeria
            </h3>
            <p className="text-gray-600">
              Navegue, busque e visualize suas fotos em alta qualidade.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
          Recursos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-xl border border-gray-100">
            <span className="text-2xl">📷</span>
            <h4 className="font-semibold text-gray-900 mt-3">
              Múltiplos Formatos
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              JPG, PNG, GIF, WEBP e até 10MB cada
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-gray-100">
            <span className="text-2xl">⚡</span>
            <h4 className="font-semibold text-gray-900 mt-3">
              Upload Rápido
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              Barra de progresso e feedback em tempo real
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-gray-100">
            <span className="text-2xl">📱</span>
            <h4 className="font-semibold text-gray-900 mt-3">
              Responsivo
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              Funciona perfeitamente em qualquer dispositivo
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-gray-100">
            <span className="text-2xl">🗂️</span>
            <h4 className="font-semibold text-gray-900 mt-3">
              Organização
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              Albums, tags e busca por data
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="text-center py-8 border-t border-gray-200">
        <p className="text-gray-500">
          Desenvolvido com ❤️ por{" "}
          <span className="font-medium text-gray-700">Humberto Santos</span>{" "}
          para{" "}
          <span className="font-medium text-gray-700">Vânia Rodrigues</span>
        </p>
      </section>
    </div>
  );
}
