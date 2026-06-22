import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import {
  listarConselheiros,
  deletarConselheiro,
  selecionarConselheiro,
} from '../../store/slices/conselho';
import { Trash2, Edit2, Plus, AlertCircle, Search } from 'lucide-react';
import { ConselheirForm } from './ConselheirForm';

export const ConselheirList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { conselheiros, isLoading, error, selectedConselheiro } = useSelector(
    (state: RootState) => state.conselho
  );

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // CARREGAR DADOS AO INICIAR
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    console.log('[ConselheirList] Carregando conselheiros...');
    dispatch(listarConselheiros(undefined));
  }, [dispatch]);

  // ═══════════════════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════

  const handleCreateNew = () => {
    dispatch(selecionarConselheiro(null));
    setShowForm(true);
  };

  const handleEdit = (id: string) => {
    const conselheiro = conselheiros.find((c) => c.id === id);
    if (conselheiro) {
      dispatch(selecionarConselheiro(conselheiro));
      setShowForm(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar este conselheiro?')) {
      return;
    }

    setDeletingId(id);
    try {
      await dispatch(deletarConselheiro(id)).unwrap();
      console.log('[ConselheirList] Conselheiro deletado com sucesso');
    } catch (err) {
      console.error('[ConselheirList] Erro ao deletar:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    dispatch(selecionarConselheiro(null));
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FILTRAR CONSELHEIROS
  // ═══════════════════════════════════════════════════════════════════════════

  const filteredConselheiros = conselheiros.filter(
    (c) =>
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  if (showForm) {
    return (
      <ConselheirForm
        conselheiro={selectedConselheiro}
        onClose={handleCloseForm}
        onSuccess={() => {
          handleCloseForm();
          dispatch(listarConselheiros(undefined));
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black mb-2">
          Conselho Presidencial
        </h1>
        <p className="text-gray-600">
          Gerenciar os 11 conselheiros da empresa
        </p>
      </div>

      {/* Erros */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-red-800 font-medium">Erro ao carregar conselheiros</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, cargo ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Botão Novo */}
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg whitespace-nowrap"
          >
            <Plus size={20} />
            Novo Conselheiro
          </button>
        </div>

        {/* Stats */}
        <div className="text-sm text-gray-600">
          Exibindo <span className="font-semibold text-black">{filteredConselheiros.length}</span> de{' '}
          <span className="font-semibold text-black">{conselheiros.length}</span> conselheiros
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Carregando conselheiros...</div>
          ) : filteredConselheiros.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nenhum conselheiro encontrado
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Nome</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Cargo</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Nacionalidade</th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredConselheiros.map((conselheiro) => (
                  <tr
                    key={conselheiro.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-3 text-gray-900 font-medium">
                      {conselheiro.nome}
                    </td>
                    <td className="px-6 py-3 text-gray-600">{conselheiro.cargo}</td>
                    <td className="px-6 py-3 text-gray-600 text-xs">
                      {conselheiro.email}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {conselheiro.nacionalidade}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          conselheiro.status === 'ativo'
                            ? 'bg-green-100 text-green-700'
                            : conselheiro.status === 'inativo'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {conselheiro.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(conselheiro.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(conselheiro.id)}
                          disabled={deletingId === conselheiro.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Deletar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Rodapé */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-gray-500 text-xs text-center">
          Total de conselheiros no sistema: {conselheiros.length}
        </p>
      </div>
    </div>
  );
};

export default ConselheirList;
