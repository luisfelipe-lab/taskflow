import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';
import App from './App.jsx';

// Pega a div#root que está no index.html e monta o componente App
// dentro dela — a partir daqui o React assume o controle da tela.
//
// Ordem importa: BrowserRouter precisa envolver o AuthProvider (os
// hooks do Router — useNavigate etc. — precisam estar disponíveis
// dentro dele), e o AuthProvider precisa envolver o App (pra qualquer
// componente da árvore poder chamar useAuth()).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
