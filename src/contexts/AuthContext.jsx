import { createContext, useContext, useState } from 'react';

// createContext() cria o canal de comunicação. O valor padrão (null) só
// é usado se algum componente tentar consumir o contexto sem estar
// dentro do AuthProvider — o que consideramos um erro de uso (ver
// useAuth abaixo).
const AuthContext = createContext(null);

// AuthProvider concentra o estado "logado" e as ações login/logout num
// único lugar. Qualquer componente dentro dele acessa isso via
// useAuth(), sem precisar receber nada por props (fim do prop drilling).
export function AuthProvider({ children }) {
  const [logado, setLogado] = useState(false);

  function login() {
    setLogado(true);
  }

  function logout() {
    setLogado(false);
  }

  return (
    <AuthContext.Provider value={{ logado, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado que encapsula useContext — os componentes importam
// só useAuth, nunca precisam saber que AuthContext existe por trás.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro do AuthProvider');
  }
  return context;
}
