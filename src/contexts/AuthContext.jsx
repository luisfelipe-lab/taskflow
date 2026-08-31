// ==================================================
// [TaskFlow] — Contexto de Autenticação (v1.0)
// ==================================================

import { createContext, useContext, useEffect, useState } from 'react';
import { getToken, clearToken } from '../services/api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [logado, setLogado] = useState(() => Boolean(getToken()));
  function login() {
    setLogado(true);
  }
  function logout() {
    clearToken();
    setLogado(false);
  }
  useEffect(() => {
    function aoExpirarSessao() {
      setLogado(false);
    }
    window.addEventListener('taskflow:sessao-expirada', aoExpirarSessao);
    return () => window.removeEventListener('taskflow:sessao-expirada', aoExpirarSessao);
  }, []);
  return (
    <AuthContext.Provider
      value={{
        logado,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro do AuthProvider');
  }
  return context;
}
