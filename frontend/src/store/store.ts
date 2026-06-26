import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from './slices/auth';
import conselhoReducer from './slices/conselho';
import departamentoReducer from './slices/departamento';
import aiReducer from './slices/ai';

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURAR STORE REDUX
// ═══════════════════════════════════════════════════════════════════════════

export const store = configureStore({
  reducer: {
    auth: authReducer,
    conselho: conselhoReducer,
    departamento: departamentoReducer,
    ai: aiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['auth.user', 'conselho.selectedConselheiro'],
      },
    }),
  devTools: import.meta.env.DEV,
});

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS TYPESCRIPT PARA REDUX
// ═══════════════════════════════════════════════════════════════════════════

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// ═══════════════════════════════════════════════════════════════════════════
// MIDDLEWARE CUSTOMIZADO — Persistência no localStorage
// ═══════════════════════════════════════════════════════════════════════════

store.subscribe(() => {
  const state = store.getState();
  const authState = {
    user: state.auth.user,
    token: state.auth.token,
    isAuthenticated: state.auth.isAuthenticated,
  };

  try {
    localStorage.setItem('auth_state', JSON.stringify(authState));
    console.log('[Redux] Estado persistido no localStorage');
  } catch (error) {
    console.error('[Redux] Erro ao persistir estado:', error);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// INICIALIZAÇÃO — Recuperar estado do localStorage
// ═══════════════════════════════════════════════════════════════════════════

export const initializeStore = () => {
  try {
    const savedAuthState = localStorage.getItem('auth_state');
    if (savedAuthState) {
      const authState = JSON.parse(savedAuthState);
      console.log('[Redux] Estado recuperado do localStorage');
      return authState;
    }
  } catch (error) {
    console.error('[Redux] Erro ao recuperar estado:', error);
  }
  return null;
};

export default store;
