import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { criarConselheiro, atualizarConselheiro } from '../../store/slices/conselho';
import { Conselheiro, ConselheirCreateRequest, ConselheirUpdateRequest } from '../../types';
import { X, Save, AlertCircle, Loader } from 'lucide-react';

interface ConselheirFormProps {
  conselheiro: Conselheiro | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ConselheirForm = ({
  conselheiro,
  onClose,
  onSuccess,
}: ConselheirFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { departamentos } = useSelector((state: RootState) => state.departamento);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    cargo: '',
    email: '',
    telefone: '',
    nacionalidade: '',
    data_nascimento: '',
    cpf: '',
    status: 'ativo' as 'ativo' | 'inativo' | 'afastado',
    departamento_id: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // ═══════════════════════════════════════════════════════════════════════════
  // CARREGAR DADOS AO EDITAR
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (conselheiro) {
      console.log('[ConselheirForm] Carregando dados do conselheiro:', conselheiro.id);
      setFormData({
        nome: conselheiro.nome,
        cargo: conselheiro.cargo,
        email: conselheiro.email,
        telefone: conselheiro.telefone,
        nacionalidade: conselheiro.nacionalidade,
        data_nascimento: conselheiro.data_nascimento,
        cpf: conselheiro.cpf,
        status: conselheiro.status,
        departamento_id: conselheiro.departamento_id,
      });
    }
  }, [conselheiro]);

  // ═══════════════════════════════════════════════════════════════════════════
  // VALIDAÇÃO
  // ═══════════════════════════════════════════════════════════════════════════

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.nome.trim()) errors.nome = 'Nome é obrigatório';
    if (!formData.cargo.trim()) errors.cargo = 'Cargo é obrigatório';
    if (!formData.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    if (!formData.telefone.trim()) errors.telefone = 'Telefone é obrigatório';
    if (!formData.nacionalidade.trim()) errors.nacionalidade = 'Nacionalidade é obrigatória';
    if (!formData.data_nascimento) errors.data_nascimento = 'Data de nascimento é obrigatória';
    if (!formData.cpf.trim()) {
      errors.cpf = 'CPF é obrigatório';
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      errors.cpf = 'CPF deve estar no formato: XXX.XXX.XXX-XX';
    }
    if (!formData.departamento_id) errors.departamento_id = 'Departamento é obrigatório';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (conselheiro) {
        console.log('[ConselheirForm] Atualizando conselheiro:', conselheiro.id);
        const updateData: ConselheirUpdateRequest = {
          nome: formData.nome,
          cargo: formData.cargo,
          email: formData.email,
          telefone: formData.telefone,
          nacionalidade: formData.nacionalidade,
          data_nascimento: formData.data_nascimento,
          cpf: formData.cpf,
          status: formData.status,
          departamento_id: formData.departamento_id,
        };
        await dispatch(
          atualizarConselheiro({ id: conselheiro.id, data: updateData })
        ).unwrap();
        console.log('[ConselheirForm] Conselheiro atualizado com sucesso');
      } else {
        console.log('[ConselheirForm] Criando novo conselheiro');
        const createData: ConselheirCreateRequest = {
          nome: formData.nome,
          cargo: formData.cargo,
          email: formData.email,
          telefone: formData.telefone,
          nacionalidade: formData.nacionalidade,
          data_nascimento: formData.data_nascimento,
          cpf: formData.cpf,
          status: formData.status,
          departamento_id: formData.departamento_id,
        };
        await dispatch(criarConselheiro(createData)).unwrap();
        console.log('[ConselheirForm] Conselheiro criado com sucesso');
      }
      onSuccess();
    } catch (err: any) {
      const errorMsg = err?.message || 'Erro ao salvar conselheiro';
      console.error('[ConselheirForm] Erro:', errorMsg);
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  const isEditing = !!conselheiro;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-black mb-2">
            {isEditing ? 'Editar Conselheiro' : 'Novo Conselheiro'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Atualize os dados do conselheiro' : 'Crie um novo membro do conselho'}
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
      <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl">
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
          {/* Linha 1: Nome e Cargo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nome" className="block text-gray-700 font-medium mb-2">
                Nome *
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: José Marciano"
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
              <label htmlFor="cargo" className="block text-gray-700 font-medium mb-2">
                Cargo *
              </label>
              <input
                type="text"
                id="cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                placeholder="Ex: Presidente"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  validationErrors.cargo
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-yellow-500'
                }`}
                disabled={isSubmitting}
              />
              {validationErrors.cargo && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.cargo}</p>
              )}
            </div>
          </div>

          {/* Linha 2: Email e Telefone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ex: jose@madson.com"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  validationErrors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-yellow-500'
                }`}
                disabled={isSubmitting}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="telefone" className="block text-gray-700 font-medium mb-2">
                Telefone *
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="Ex: (11) 9999-9999"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  validationErrors.telefone
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-yellow-500'
                }`}
                disabled={isSubmitting}
              />
              {validationErrors.telefone && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.telefone}</p>
              )}
            </div>
          </div>

          {/* Linha 3: Nacionalidade e Data de Nascimento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nacionalidade" className="block text-gray-700 font-medium mb-2">
                Nacionalidade *
              </label>
              <input
                type="text"
                id="nacionalidade"
                name="nacionalidade"
                value={formData.nacionalidade}
                onChange={handleChange}
                placeholder="Ex: Brasileira"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  validationErrors.nacionalidade
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-yellow-500'
                }`}
                disabled={isSubmitting}
              />
              {validationErrors.nacionalidade && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.nacionalidade}</p>
              )}
            </div>

            <div>
              <label htmlFor="data_nascimento" className="block text-gray-700 font-medium mb-2">
                Data de Nascimento *
              </label>
              <input
                type="date"
                id="data_nascimento"
                name="data_nascimento"
                value={formData.data_nascimento}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  validationErrors.data_nascimento
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-yellow-500'
                }`}
                disabled={isSubmitting}
              />
              {validationErrors.data_nascimento && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.data_nascimento}</p>
              )}
            </div>
          </div>

          {/* Linha 4: CPF e Departamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="cpf" className="block text-gray-700 font-medium mb-2">
                CPF *
              </label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="Ex: 123.456.789-00"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  validationErrors.cpf
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-yellow-500'
                }`}
                disabled={isSubmitting}
              />
              {validationErrors.cpf && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.cpf}</p>
              )}
            </div>

            <div>
              <label htmlFor="departamento_id" className="block text-gray-700 font-medium mb-2">
                Departamento *
              </label>
              <select
                id="departamento_id"
                name="departamento_id"
                value={formData.departamento_id}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  validationErrors.departamento_id
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-yellow-500'
                }`}
                disabled={isSubmitting}
              >
                <option value="">Selecionar departamento...</option>
                {departamentos.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.nome}
                  </option>
                ))}
              </select>
              {validationErrors.departamento_id && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.departamento_id}</p>
              )}
            </div>
          </div>

          {/* Linha 5: Status */}
          <div>
            <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              disabled={isSubmitting}
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="afastado">Afastado</option>
            </select>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-6 border-t">
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
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-gray-400 disabled:to-gray-500 text-black font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
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
  );
};

export default ConselheirForm;
