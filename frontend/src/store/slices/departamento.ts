import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DepartamentoState, DepartamentoCreateRequest, DepartamentoUpdateRequest } from '../../types';
import { departamentoService } from '../../services/api';

// ═══════════════════════════════════════════════════════════════════════════
// ESTADO INICIAL
// ═══════════════════════════════════════════════════════════════════════════

const initialState: DepartamentoState = {
  departamentos: [],
  selectedDepartamento: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,
};

// ═══════════════════════════════════════════════════════════════════════════
// ASYNC THUNKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Thunk: Listar todos os departamentos
 * GET /api/departamentos
 */
export const listarDepartamentos = createAsyncThunk(
  'departamento/listarDepartamentos',
  async (params: Record<string, any> | undefined, { rejectWithValue }) => {
    try {
      console.log('[Departamento] Buscando departamentos...');
      const response = await departamentoService.listar(params);
      console.log('[Departamento] Departamentos carregados:', response.data?.length || 0);
      return response.data;
    } catch (error: any) {
      console.error('[Departamento] Erro ao listar:', error);
      return rejectWithValue(error.message || 'Erro ao listar departamentos');
    }
  }
);

/**
 * Thunk: Obter departamento por ID
 * GET /api/departamentos/:id
 */
export const obterDepartamento = createAsyncThunk(
  'departamento/obterDepartamento',
  async (id: string, { rejectWithValue }) => {
    try {
      console.log('[Departamento] Buscando departamento:', id);
      const response = await departamentoService.obterPorId(id);
      console.log('[Departamento] Departamento encontrado');
      return response.data;
    } catch (error: any) {
      console.error('[Departamento] Erro ao obter departamento:', error);
      return rejectWithValue(error.message || 'Erro ao obter departamento');
    }
  }
);

/**
 * Thunk: Criar novo departamento
 * POST /api/departamentos
 */
export const criarDepartamento = createAsyncThunk(
  'departamento/criarDepartamento',
  async (data: DepartamentoCreateRequest, { rejectWithValue }) => {
    try {
      console.log('[Departamento] Criando novo departamento:', data.nome);
      const response = await departamentoService.criar(data);
      console.log('[Departamento] Departamento criado com sucesso');
      return response.data;
    } catch (error: any) {
      console.error('[Departamento] Erro ao criar departamento:', error);
      return rejectWithValue(error.message || 'Erro ao criar departamento');
    }
  }
);

/**
 * Thunk: Atualizar departamento
 * PUT /api/departamentos/:id
 */
export const atualizarDepartamento = createAsyncThunk(
  'departamento/atualizarDepartamento',
  async ({ id, data }: { id: string; data: DepartamentoUpdateRequest }, { rejectWithValue }) => {
    try {
      console.log('[Departamento] Atualizando departamento:', id);
      const response = await departamentoService.atualizar(id, data);
      console.log('[Departamento] Departamento atualizado com sucesso');
      return response.data;
    } catch (error: any) {
      console.error('[Departamento] Erro ao atualizar departamento:', error);
      return rejectWithValue(error.message || 'Erro ao atualizar departamento');
    }
  }
);

/**
 * Thunk: Deletar departamento
 * DELETE /api/departamentos/:id
 */
export const deletarDepartamento = createAsyncThunk(
  'departamento/deletarDepartamento',
  async (id: string, { rejectWithValue }) => {
    try {
      console.log('[Departamento] Deletando departamento:', id);
      await departamentoService.deletar(id);
      console.log('[Departamento] Departamento deletado com sucesso');
      return id;
    } catch (error: any) {
      console.error('[Departamento] Erro ao deletar departamento:', error);
      return rejectWithValue(error.message || 'Erro ao deletar departamento');
    }
  }
);

// ═══════════════════════════════════════════════════════════════════════════
// SLICE
// ═══════════════════════════════════════════════════════════════════════════

const departamentoSlice = createSlice({
  name: 'departamento',
  initialState,
  reducers: {
    /**
     * Action: Selecionar departamento
     */
    selecionarDepartamento: (state, action) => {
      state.selectedDepartamento = action.payload;
    },

    /**
     * Action: Desselecionar departamento
     */
    desselecionarDepartamento: (state) => {
      state.selectedDepartamento = null;
    },

    /**
     * Action: Limpar erro
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Action: Mudar página
     */
    mudarPagina: (state, action) => {
      state.currentPage = action.payload;
    },

    /**
     * Action: Mudar tamanho da página
     */
    mudarTamanho: (state, action) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },

    /**
     * Action: Resetar slice
     */
    resetDepartamento: (state) => {
      state.departamentos = [];
      state.selectedDepartamento = null;
      state.isLoading = false;
      state.error = null;
      state.totalCount = 0;
      state.currentPage = 1;
      state.pageSize = 10;
    },
  },

  /**
   * Handlers para async thunks
   */
  extraReducers: (builder) => {
    // ─────────────────────────────────────────────────────────────────────
    // LISTAR DEPARTAMENTOS
    // ─────────────────────────────────────────────────────────────────────
    builder
      .addCase(listarDepartamentos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(listarDepartamentos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.departamentos = action.payload || [];
        state.totalCount = (action.payload || []).length;
        console.log('[Departamento] Lista carregada:', state.departamentos.length);
      })
      .addCase(listarDepartamentos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        console.error('[Departamento] Erro ao listar:', state.error);
      });

    // ─────────────────────────────────────────────────────────────────────
    // OBTER DEPARTAMENTO
    // ─────────────────────────────────────────────────────────────────────
    builder
      .addCase(obterDepartamento.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(obterDepartamento.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedDepartamento = action.payload;
      })
      .addCase(obterDepartamento.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ─────────────────────────────────────────────────────────────────────
    // CRIAR DEPARTAMENTO
    // ─────────────────────────────────────────────────────────────────────
    builder
      .addCase(criarDepartamento.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(criarDepartamento.fulfilled, (state, action) => {
        state.isLoading = false;
        state.departamentos.push(action.payload);
        state.totalCount++;
        console.log('[Departamento] Novo departamento adicionado');
      })
      .addCase(criarDepartamento.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ─────────────────────────────────────────────────────────────────────
    // ATUALIZAR DEPARTAMENTO
    // ─────────────────────────────────────────────────────────────────────
    builder
      .addCase(atualizarDepartamento.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(atualizarDepartamento.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.departamentos.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.departamentos[index] = action.payload;
        }
        if (state.selectedDepartamento?.id === action.payload.id) {
          state.selectedDepartamento = action.payload;
        }
        console.log('[Departamento] Departamento atualizado');
      })
      .addCase(atualizarDepartamento.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ─────────────────────────────────────────────────────────────────────
    // DELETAR DEPARTAMENTO
    // ─────────────────────────────────────────────────────────────────────
    builder
      .addCase(deletarDepartamento.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletarDepartamento.fulfilled, (state, action) => {
        state.isLoading = false;
        state.departamentos = state.departamentos.filter((d) => d.id !== action.payload);
        state.totalCount--;
        if (state.selectedDepartamento?.id === action.payload) {
          state.selectedDepartamento = null;
        }
        console.log('[Departamento] Departamento deletado');
      })
      .addCase(deletarDepartamento.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export const {
  selecionarDepartamento,
  desselecionarDepartamento,
  clearError,
  mudarPagina,
  mudarTamanho,
  resetDepartamento,
} = departamentoSlice.actions;

export default departamentoSlice.reducer;
