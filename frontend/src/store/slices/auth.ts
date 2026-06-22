import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, LoginRequest, LoginResponse } from '../../types';
import { authService } from '../../services/api';

// ═══════════════════════════════════════════════════════════════════════════
// ESTADO INICIAL
// ═══════════════════════════════════════════════════════════════════════════

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// ═══════════════════════════════════════════════════════════════════════════
// ASYNC THUNKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Thunk: Fazer login do usuário
 * POST /api/auth/login
 */
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      console.log('[Auth] Iniciando login para:', credentials.email);
      const response = await authService.login(credentials);
      console.log('[Auth] Login bem-sucedido');
      return response;
    } catch (error: any) {
      console.error('[Auth] Erro no login:', error);
      return rejectWithValue(error.message || 'Erro ao fazer login');
    }
  }
);

/**
 * Thunk: Verificar autenticação ao carregar a app
 * Recupera token do localStorage e valida
 */
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = authService.getToken();
      const user = authService.getCurrentUser();

      if (token && user) {
        console.log('[Auth] Sessão válida encontrada');
        return { token, user };
      }

      console.log('[Auth] Nenhuma sessão válida');
      return rejectWithValue('Sem autenticação');
    } catch (error: any) {
      console.error('[Auth] Erro ao verificar autenticação:', error);
      return rejectWithValue(error.message);
    }
  }
);

// ═══════════════════════════════════════════════════════════════════════════
// SLICE
// ═══════════════════════════════════════════════════════════════════════════

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Action: Logout (síncrona)
     */
    logout: (state) => {
      console.log('[Auth] Fazendo logout');
      authService.logout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    /**
     * Action: Limpar erro
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Action: Resetar estado
     */
    resetAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
    },

    /**
     * Action: Atualizar dados do usuário
     */
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },

  /**
   * Handlers para async thunks
   */
  extraReducers: (builder) => {
    // ─────────────────────────────────────────────────────────────────────
    // LOGIN
    // ─────────────────────────────────────────────────────────────────────
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        console.log('[Auth] Login fulfillido');
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        console.error('[Auth] Login rejeitado:', state.error);
      });

    // ─────────────────────────────────────────────────────────────────────
    // CHECK AUTH
    // ─────────────────────────────────────────────────────────────────────
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        console.log('[Auth] Autenticação verificada');
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        console.log('[Auth] Autenticação inválida');
      });
  },
});

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export const { logout, clearError, resetAuth, updateUser } = authSlice.actions;
export default authSlice.reducer;
