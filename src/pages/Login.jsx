// ==================================================
// [TaskFlow] — Página de Login (v1.0)
// ==================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fazerLogin, setToken } from '../services/api';
import './Login.css';
function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [shake, setShake] = useState(false);
  const [entrando, setEntrando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  async function handleLogin() {
    setErro('');
    setEntrando(true);
    try {
      const resposta = await fazerLogin(usuario, senha);
      setToken(resposta.token);
      login();
      navigate('/');
    } catch (erroApi) {
      setErro(erroApi.message);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setEntrando(false);
    }
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
          onKeyDown={(e) => e.key === 'Enter' && !entrando && handleLogin()}
          disabled={entrando}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !entrando && handleLogin()}
          disabled={entrando}
        />

        {erro && <p className="login-erro">{erro}</p>}

        <button type="button" className="login-btn" onClick={handleLogin} disabled={entrando}>
          {entrando ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
    </div>
  );
}
export default Login;
