import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ConselhoState, ConselheirCreateRequest, ConselheirUpdateRequest } from '../../types';
import { conselhoService } from '../../services/api';

// ═══════════════════════════════════════════════════════════════════════════
// ESTADO INICIAL
// ═══════════════════════════════════════════════════════════════════════════

const initialState: ConselhoState = {
  conselheiros: [],
  selectedConselheiro: null,
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
 * Thunk: Listar todos os conselheiros
 * GET /api/conselho
 */
export const listarConselheiros = createAsyncThunk(
  'conselho/listarConselheiros',
  async (params: Record<string, any> | undefined, { rejectWithValue }) => {
    try {
      console.log('[Conselho] Buscando conselheiros...');
      const response = await conselhoService.listar(params);
      console.log('[Conselho] Conselheiros carregados:', response.data?.length || 0);
      return response.data;
    } catch (error: any) {
      console.error('[Conselho] Erro ao listar:', error);
      return rejectWithValue(error.message || 'Erro ao listar conselheiros');
    }
  }
);

/**
 * Thunk: Obter conselheiro por ID
 * GET /api/conselho/:id
 */
export const obterConselheiro = createAsyncThunk(
  'conselho/obterConselheiro',
  async (id: string, { rejectWithValue }) => {
    try {
      console.log('[Conselho] Buscando conselheiro:', id);
      const response = await conselhoService.obterPorId(id);
      console.log('[Conselho] Conselheiro encontrado');
      return response.data;
    } catch (error: any) {
      console.error('[Conselho] Erro ao obter conselheiro:', error);
      return rejectWithValue(error.message || 'Erro ao obter conselheiro');
    }
  }
);

/**
 * Thunk: Criar novo conselheiro
 * POST /api/conselho
 */
export const criarConselheiro = createAsyncThunk(
  'conselho/criarConselheiro',
  async (data: ConselheirCreateRequest, { rejectWithValue }) => {
    try {
      console.log('[Conselho] Criando novo conselheiro:', data.nome);
      const response = await conselhoService.criar(data);
      console.log('[Conselho] Conselheiro criado com sucesso');
      return response.data;
    } catch (error: any) {
      console.error('[Conselho] Erro ao criar conselheiro:', error);
      return rejectWithValue(error.message || 'Erro ao criar conselheiro');
    }
  }
);

/**
 * Thunk: Atualizar conselheiro
 * PUT /api/conselho/:id
 */
export const atualizarConselheiro = createAsyncThunk(
  'conselho/atualizarConselheiro',
  async ({ id, data }: { id: string; data: ConselheirUpdateRequest }, { rejectWithValue }) => {
    try {
      console.log('[Conselho] Atualizando conselheiro:', id);
      const response = await conselhoService.atualizar(id, data);
      console.log('[Conselho] Conselheiro atualizado com sucesso');
      return response.data;
    } catch (error: any) {
      console.error('[Conselho] Erro ao atualizar conselheiro:', error);
      return rejectWithValue(error.message || 'Erro ao atualizar conselheiro');
    }
  }
);

/**
 * Thunk: Deletar conselheiro
 * DELETE /api/conselho/:id
 */
export const deletarConselheiro = createAsyncThunk(
  'conselho/deletarConselheiro',
  async (id: string, { rejectWithValue }) => {
    try {
      console.log('[Conselho] Deletando conselheiro:', id);
      await conselhoService.deletar(id);
      console.log('[Conselho] Conselheiro deletado com sucesso');
      return id;
    } catch (error: any) {
      console.error('[Conselho] Erro ao deletar conselheiro:', error);
      return rejectWithValue(error.message || 'Erro ao deletar conselheiro');
    }
  }
);

// ═══════════════════════════════════════════════════════════════════════════
// SLICE
// ═══════════════════════════════════════════════════════════════════════════

const conselhoSlice = createSlice({
  name: 'conselho',
  initialState,
  reducers: {
    /**
     * Action: Selecionar conselheiro
     */
    selecionarConselheiro: (state, action) => {
      state.selectedConselheiro = action.payload;
    },

    /**
     * Action: Desselecionar conselheiro
     */
    desselecionarConselheiro: (state) => {
      state.selectedConselheiro = null;
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
    resetConselho: (state) => {
      state.conselheiros = [];
      state.selectedConselheiro = null;
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
    // LISTAR CONSELHEIROS
    // ─────────────────────────────────────────────────────────────────────
    builder
      .addCase(listarConselheiros.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(listarConselheiros.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conselheiros = action.payload || [];
        state.totalCount = (action.payload || []).length;
        console.log('[Conselho] Lista carregada:', state.conselheiros.length);
      })
      .addCase(listarConselheiros.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        console.error('[Conselho] Erro ao listar:', state.error);
      });

    // ─────────────────────────────────────────────────────────────────────
    // OBTER CONSELHEIRO
    // ─────────────────────────────────────────────────────────────────────
    builder
      .addCase(obterConselheiro.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(obterConselheiro.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedConselheiro = action.payload;
      })
      .addCase(obterConselheiro.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ─────────────────────────────────────────────────────────────────────
    // CRIAR CONSELHEIRO
    // ─────────────────────────────────────────────────────────────────────
    builder
      .addCase(criarConselheiro.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(criarConselheiro.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conselheiros.push(action.payload);
        state.totalCount++;
        console.log('[Conselho] Novo conselheiro adicionado');
      })
      .addCase(criarConselheiro.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ─────────────────────────────────────────────────────────────────────
    // ATUALIZAR CONSELHEIRO
    // ─────────────────────────────────────────────────────────────────────
    builder
      .addCase(atualizarConselheiro.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(atualizarConselheiro.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.conselheiros.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.conselheiros[index] = action.payload;
        }
        if (state.selectedConselheiro?.id === action.payload.id) {
          state.selectedConselheiro = action.payload;
        }
        console.log('[Conselho] Conselheiro atualizado');
      })
      .addCase(atualizarConselheiro.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ─────────────────────────────────────────────────────────────────────
    // DELETAR CONSELHEIRO
    // ─────────────────────────────────────────────────────────────────────
    builder
      .addCase(deletarConselheiro.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletarConselheiro.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conselheiros = state.conselheiros.filter((c) => c.id !== action.payload);
        state.totalCount--;
        if (state.selectedConselheiro?.id === action.payload) {
          state.selectedConselheiro = null;
        }
        console.log('[Conselho] Conselheiro deletado');
      })
      .addCase(deletarConselheiro.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export const {
  selecionarConselheiro,
  desselecionarConselheiro,
  clearError,
  mudarPagina,
  mudarTamanho,
  resetConselho,
} = conselhoSlice.actions;

export default conselhoSlice.reducer;
