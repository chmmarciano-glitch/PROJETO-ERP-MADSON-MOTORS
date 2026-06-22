import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import {
  listarDepartamentos,
  deletarDepartamento,
  selecionarDepartamento,
} from '../../store/slices/departamento';
import { Trash2, Edit2, Plus, AlertCircle, Search, Building2 } from 'lucide-react';
import { DepartamentoForm } from './DepartamentoForm';

export const DepartamentoList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { departamentos, isLoading, error, selectedDepartamento } = useSelector(
    (state: RootState) => state.departamento
  );

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    console.log('[DepartamentoList] Carregando departamentos...');
    dispatch(listarDepartamentos(undefined));
  }, [dispatch]);

  const handleCreateNew = () => {
    dispatch(selecionarDepartamento(null));
    setShowForm(true);
  };

  const handleEdit = (id: string) => {
    const departamento = departamentos.find((d) => d.id === id);
    if (departamento) {
      dispatch(selecionarDepartamento(departamento));
      setShowForm(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar este departamento?')) {
      return;
    }

    setDeletingId(id);
    try {
      await dispatch(deletarDepartamento(id)).unwrap();
      console.log('[DepartamentoList] Departamento deletado com sucesso');
    } catch (err) {
      console.error('[DepartamentoList] Erro ao deletar:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    dispatch(selecionarDepartamento(null));
  };

  const filteredDepartamentos = departamentos.filter((d) =>
    d.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.localizacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showForm) {
    return (
      <DepartamentoForm
        departamento={selectedDepartamento}
        onClose={handleCloseForm}
        onSuccess={() => {
          handleCloseForm();
          dispatch(listarDepartamentos(undefined));
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black mb-2 flex items-center gap-3">
          <Building2 size={36} className="text-yellow-500" />
          Departamentos
        </h1>
        <p className="text-gray-600">
          Gerenciar os 9 departamentos da empresa
        </p>
      </div>

      {/* Erros */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-red-800 font-medium">Erro ao carregar departamentos</p>
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
              placeholder="Buscar por nome, localização ou descrição..."
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
            Novo Departamento
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>
            Exibindo{' '}
            <span className="font-semibold text-black">{filteredDepartamentos.length}</span>{' '}
            de{' '}
            <span className="font-semibold text-black">{departamentos.length}</span>{' '}
            departamentos
          </span>
          <span className="text-green-600 font-medium">
            ● {departamentos.filter((d) => d.status === 'ativo').length} ativos
          </span>
          <span className="text-red-500 font-medium">
            ● {departamentos.filter((d) => d.status === 'inativo').length} inativos
          </span>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-black to-gray-900 px-6 py-4 border-b-4 border-yellow-500">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 size={22} className="text-yellow-500" />
            Lista de Departamentos
          </h2>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              Carregando departamentos...
            </div>
          ) : filteredDepartamentos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhum departamento encontrado
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Localização
                  </th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-700">
                    Budget (Cr$)
                  </th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartamentos.map((departamento) => (
                  <tr
                    key={departamento.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-3 text-gray-900 font-semibold">
                      {departamento.nome}
                    </td>
                    <td className="px-6 py-3 text-gray-600 max-w-xs truncate">
                      {departamento.descricao}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {departamento.localizacao}
                    </td>
                    <td className="px-6 py-3 text-gray-700 text-right font-mono">
                      {departamento.budget.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          departamento.status === 'ativo'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {departamento.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(departamento.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(departamento.id)}
                          disabled={deletingId === departamento.id}
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
          Total de departamentos no sistema: {departamentos.length} —
          Madson Motors do Brasil S.A.
        </p>
      </div>
    </div>
  );
};

export default DepartamentoList;
