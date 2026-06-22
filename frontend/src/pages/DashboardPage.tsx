import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { listarConselheiros } from '../store/slices/conselho';
import { listarDepartamentos } from '../store/slices/departamento';
import { Users, Building2, TrendingUp, AlertCircle } from 'lucide-react';

export const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { conselheiros, isLoading: conselhoLoading, error: conselhoError } = useSelector(
    (state: RootState) => state.conselho
  );
  const { departamentos, isLoading: departamentoLoading, error: departamentoError } = useSelector(
    (state: RootState) => state.departamento
  );
  const { user } = useSelector((state: RootState) => state.auth);

  // ═══════════════════════════════════════════════════════════════════════════
  // CARREGAR DADOS AO INICIAR
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    console.log('[Dashboard] Carregando dados...');
    dispatch(listarConselheiros(undefined));
    dispatch(listarDepartamentos(undefined));
  }, [dispatch]);

  // ═══════════════════════════════════════════════════════════════════════════
  // DADOS PARA KPIs
  // ═══════════════════════════════════════════════════════════════════════════

  const totalConselheiros = conselheiros.length;
  const totalDepartamentos = departamentos.length;
  const conselheirosAtivos = conselheiros.filter((c) => c.status === 'ativo').length;
  const departamentosAtivos = departamentos.filter((d) => d.status === 'ativo').length;

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Bem-vindo, <span className="font-semibold text-black">{user?.name || 'Usuário'}</span>
        </p>
      </div>

      {/* Erros */}
      {(conselhoError || departamentoError) && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-red-800 font-medium">Erro ao carregar dados</p>
            <p className="text-red-700 text-sm">
              {conselhoError || departamentoError}
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Total Conselheiros */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Conselheiros</p>
              <p className="text-3xl font-bold text-black mt-2">
                {conselhoLoading ? '...' : totalConselheiros}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                {conselheirosAtivos} ativos
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Users className="text-yellow-600" size={32} />
            </div>
          </div>
        </div>

        {/* Card 2: Total Departamentos */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Departamentos</p>
              <p className="text-3xl font-bold text-black mt-2">
                {departamentoLoading ? '...' : totalDepartamentos}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                {departamentosAtivos} ativos
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Building2 className="text-blue-600" size={32} />
            </div>
          </div>
        </div>

        {/* Card 3: Taxa de Ocupação */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Taxa de Ocupação</p>
              <p className="text-3xl font-bold text-black mt-2">
                {totalConselheiros > 0
                  ? Math.round((conselheirosAtivos / totalConselheiros) * 100)
                  : 0}
                %
              </p>
              <p className="text-gray-500 text-xs mt-2">Conselheiros ativos</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="text-green-600" size={32} />
            </div>
          </div>
        </div>

        {/* Card 4: Status Sistema */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Status Sistema</p>
              <p className="text-xl font-bold text-green-600 mt-2">Operacional</p>
              <p className="text-gray-500 text-xs mt-2">Backend conectado</p>
            </div>
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Tabelas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tabela Conselheiros */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-black to-gray-900 px-6 py-4 border-b-4 border-yellow-500">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users size={24} className="text-yellow-500" />
              Últimos Conselheiros
            </h2>
          </div>
          <div className="overflow-x-auto">
            {conselhoLoading ? (
              <div className="p-6 text-center text-gray-500">Carregando...</div>
            ) : conselheiros.length === 0 ? (
              <div className="p-6 text-center text-gray-500">Nenhum conselheiro encontrado</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Nome</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Cargo</th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {conselheiros.slice(0, 5).map((conselheiro) => (
                    <tr key={conselheiro.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 text-gray-900 font-medium">{conselheiro.nome}</td>
                      <td className="px-6 py-3 text-gray-600">{conselheiro.cargo}</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Tabela Departamentos */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-black to-gray-900 px-6 py-4 border-b-4 border-blue-500">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Building2 size={24} className="text-blue-400" />
              Últimos Departamentos
            </h2>
          </div>
          <div className="overflow-x-auto">
            {departamentoLoading ? (
              <div className="p-6 text-center text-gray-500">Carregando...</div>
            ) : departamentos.length === 0 ? (
              <div className="p-6 text-center text-gray-500">Nenhum departamento encontrado</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Nome</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Localização</th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {departamentos.slice(0, 5).map((departamento) => (
                    <tr key={departamento.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 text-gray-900 font-medium">{departamento.nome}</td>
                      <td className="px-6 py-3 text-gray-600">{departamento.localizacao}</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-gray-500 text-xs text-center">
          Madson Motors ERP — Fase 3 Frontend — {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
