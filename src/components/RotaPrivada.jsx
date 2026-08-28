import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// RotaPrivada faz o papel do "porteiro": só deixa o children passar se
// o usuário estiver logado. A verificação acontece NO RENDER — por
// isso usamos <Navigate>, não useNavigate (que seria pra reagir a um
// evento, tipo um clique).
function RotaPrivada({ children }) {
  const { logado } = useAuth();

  if (!logado) {
    // replace: substitui o histórico, pro botão Voltar não levar de
    // volta pro Dashboard depois do redirecionamento.
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RotaPrivada;
