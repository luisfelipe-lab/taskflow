import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

// Credenciais fixas — apenas para fins didáticos. Autenticação de
// verdade (com banco de dados e hash de senha) fica pro módulo de
// back-end, mais adiante no curso.
function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [shake, setShake] = useState(false);

  const { login } = useAuth();
  // useNavigate é usado AQUI dentro (num handler, após o clique) — se
  // fosse uma condição avaliada direto no render, usaríamos <Navigate>
  // (é o que a RotaPrivada faz).
  const navigate = useNavigate();

  function handleLogin() {
    if (usuario === 'admin' && senha === '1234') {
      login();
      navigate('/');
      return;
    }

    setErro('Usuário ou senha incorretos');
    setShake(true);
    // Remove a classe depois da animação terminar, pra poder disparar
    // de novo numa próxima tentativa errada (senão o CSS não reanima
    // uma classe que já está aplicada).
    setTimeout(() => setShake(false), 500);
  }

  return (
    <div className="login-container">
      <div className={`login-card ${shake ? 'shake' : ''}`}>
        <h1 className="login-logo">TaskFlow</h1>
        <p className="login-subtitulo">Faça login para continuar</p>

        <input
          className="login-input"
          type="text"
          placeholder="Usuário"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />

        {erro && <p className="login-erro">{erro}</p>}

        <button type="button" className="login-btn" onClick={handleLogin}>
          Entrar
        </button>
      </div>
    </div>
  );
}

export default Login;
