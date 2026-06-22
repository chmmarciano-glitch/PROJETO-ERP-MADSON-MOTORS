import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      {/* Decoração de fundo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-2000"></div>

      {/* Contêiner */}
      <div className="relative text-center max-w-md">
        {/* Ícone */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <AlertCircle size={64} className="text-white" />
            </div>
            <div className="absolute inset-0 w-32 h-32 bg-red-500 rounded-full opacity-20 animate-ping"></div>
          </div>
        </div>

        {/* Código 404 */}
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600 mb-2">
          404
        </h1>

        {/* Mensagem */}
        <h2 className="text-3xl font-bold text-white mb-4">
          Página não encontrada
        </h2>

        <p className="text-gray-400 text-lg mb-8">
          Desculpe, a página que você está procurando não existe ou foi removida.
        </p>

        {/* Informação adicional */}
        <div className="bg-gray-900 border border-yellow-500 border-opacity-30 rounded-lg p-6 mb-8">
          <p className="text-gray-300 text-sm">
            <span className="text-yellow-500 font-semibold">Erro:</span> A URL solicitada não corresponde a nenhuma rota válida no sistema.
          </p>
        </div>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors border border-gray-700 hover:border-yellow-500"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <Home size={20} />
            Dashboard
          </button>
        </div>

        {/* Rodapé */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-gray-500 text-xs">
            Madson Motors ERP — Sistema de Controle Corporativo
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Se o problema persistir, contate o administrador do sistema.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
