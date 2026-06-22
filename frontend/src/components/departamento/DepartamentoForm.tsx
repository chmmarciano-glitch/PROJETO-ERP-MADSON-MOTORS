import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { criarDepartamento, atualizarDepartamento } from '../../store/slices/departamento';
import {
  Departamento,
  DepartamentoCreateRequest,
  DepartamentoUpdateRequest,
} from '../../types';
import { X, Save, AlertCircle, Loader, Building2 } from 'lucide-react';

interface DepartamentoFormProps {
  departamento: Departamento | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const DepartamentoForm = ({
  departamento,
  onClose,
  onSuccess,
}: DepartamentoFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { conselheiros } = useSelector((state: RootState) => state.conselho);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    gerente_id: '',
    localizacao: '',
    status: 'ativo' as 'ativo' | 'inativo',
    budget: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (departamento) {
      console.log('[DepartamentoForm] Carregando dados do departamento:', departamento.id);
      setFormData({
        nome: departamento.nome,
        descricao: departamento.descricao,
        gerente_id: departamento.gerente_id,
        localizacao: departamento.localizacao,
        status: departamento.status,
        budget: String(departamento.budget),
      });
    }
  }, [departamento]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      errors.nome = 'Nome é obrigatório';
    }
    if (!formData.descricao.trim()) {
      errors.descricao = 'Descrição é obrigatória';
    }
    if (!formData.gerente_id) {
      errors.gerente_id = 'Gerente é obrigatório';
    }
    if (!formData.localizacao.trim()) {
      errors.localizacao = 'Localização é obrigatória';
    }
    if (!formData.budget) {
      errors.budget = 'Budget é obrigatório';
    } else if (isNaN(Number(formData.budget)) || Number(formData.budget) < 0) {
      errors.budget = 'Budget deve ser um número positivo';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (departamento) {
        console.log('[DepartamentoForm] Atualizando departamento:', departamento.id);
        const updateData: DepartamentoUpdateRequest = {
          nome: formData.nome,
          descricao: formData.descricao,
          gerente_id: formData.gerente_id,
          localizacao: formData.localizacao,
          status: formData.status,
          budget: Number(formData.budget),
        };
        await dispatch(
          atualizarDepartamento({ id: departamento.id, data: updateData })
        ).unwrap();
        console.log('[DepartamentoForm] Departamento atualizado com sucesso');
      } else {
        console.log('[DepartamentoForm] Criando novo departamento');
        const createData: DepartamentoCreateRequest = {
          nome: formData.nome,
          descricao: formData.descricao,
          gerente_id: formData.gerente_id,
          localizacao: formData.localizacao,
          status: formData.status,
          budget: Number(formData.budget),
        };
        await dispatch(criarDepartamento(createData)).unwrap();
        console.log('[DepartamentoForm] Departamento criado com sucesso');
      }
      onSuccess();
    } catch (err: any) {
      const errorMsg = err?.message || 'Erro ao salvar departamento';
      console.error('[DepartamentoForm] Erro:', errorMsg);
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = !!departamento;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-black mb-2 flex items-center gap-3">
            <Building2 size={36} className="text-yellow-500" />
            {isEditing ? 'Editar Departamento' : 'Novo Departamento'}
          </h1>
          <p className="text-gray-600">
            {isEditing
              ? 'Atualize os dados do departamento'
              : 'Crie um novo departamento da empresa'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <X size={24} className="text-gray-600" />
        </button>
      </div>

      {/* Formulário */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl">
        {/* Barra dourada */}
        <div className="h-1 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>

        <div className="p-8">
          {/* Erro geral */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-red-800 font-medium">Erro ao salvar</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Linha 1: Nome e Localização */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nome" className="block text-gray-700 font-medium mb-2">
                  Nome do Departamento *
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Ex: Departamento Industrial"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    validationErrors.nome
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-yellow-500'
                  }`}
                  disabled={isSubmitting}
                />
                {validationErrors.nome && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.nome}</p>
                )}
              </div>

              <div>
                <label htmlFor="localizacao" className="block text-gray-700 font-medium mb-2">
                  Localização *
                </label>
                <input
                  type="text"
                  id="localizacao"
                  name="localizacao"
                  value={formData.localizacao}
                  onChange={handleChange}
                  placeholder="Ex: Bloco A — Araras, SP"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    validationErrors.localizacao
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-yellow-500'
                  }`}
                  disabled={isSubmitting}
                />
                {validationErrors.localizacao && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.localizacao}</p>
                )}
              </div>
            </div>

            {/* Linha 2: Descrição */}
            <div>
              <label htmlFor="descricao" className="block text-gray-700 font-medium mb-2">
                Descrição *
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Descreva as responsabilidades e funções do departamento..."
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
                  validationErrors.descricao
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-yellow-500'
                }`}
                disabled={isSubmitting}
              />
              {validationErrors.descricao && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.descricao}</p>
              )}
            </div>

            {/* Linha 3: Gerente e Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="gerente_id" className="block text-gray-700 font-medium mb-2">
                  Gerente Responsável *
                </label>
                <select
                  id="gerente_id"
                  name="gerente_id"
                  value={formData.gerente_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    validationErrors.gerente_id
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-yellow-500'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Selecionar gerente...</option>
                  {conselheiros.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome} — {c.cargo}
                    </option>
                  ))}
                </select>
                {validationErrors.gerente_id && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.gerente_id}</p>
                )}
              </div>

              <div>
                <label htmlFor="budget" className="block text-gray-700 font-medium mb-2">
                  Budget Anual (Cr$) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500 font-medium text-sm">
                    Cr$
                  </span>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      validationErrors.budget
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-yellow-500'
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                {validationErrors.budget && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.budget}</p>
                )}
                {formData.budget && !validationErrors.budget && (
                  <p className="text-gray-500 text-xs mt-1">
                    {Number(formData.budget).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}{' '}
                    Cruzeiros
                  </p>
                )}
              </div>
            </div>

            {/* Linha 4: Status */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Status</label>
              <div className="flex gap-6">
                {(['ativo', 'inativo'] as const).map((s) => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={s}
                      checked={formData.status === s}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="accent-yellow-500 w-4 h-4"
                    />
                    <span
                      className={`font-medium capitalize ${
                        s === 'ativo' ? 'text-green-700' : 'text-red-600'
                      }`}
                    >
                      {s}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-gray-400 disabled:to-gray-500 text-black font-semibold rounded-lg transition-colors disabled:cursor-not-allowed shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    {isEditing ? 'Atualizar' : 'Criar'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Rodapé */}
      <div className="mt-8 pt-6 border-t border-gray-200 max-w-4xl">
        <p className="text-gray-500 text-xs text-center">
          Madson Motors do Brasil S.A. — Todos os valores em Cruzeiros (Cr$) — Janeiro de 1952
        </p>
      </div>
    </div>
  );
};

export default DepartamentoForm;
