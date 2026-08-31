// ==================================================
// [TaskFlow] — Roteamento e Layout Principal (v1.0)
// ==================================================

import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import RotaPrivada from './components/RotaPrivada';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Sobre from './pages/Sobre';
import NaoEncontrada from './pages/NaoEncontrada';
function App() {
  const location = useLocation();
  const naPaginaDeLogin = location.pathname === '/login';
  return (
    <div className={naPaginaDeLogin ? 'app-layout app-layout-sem-sidebar' : 'app-layout'}>
      {!naPaginaDeLogin && <Sidebar />}

      <main className={naPaginaDeLogin ? 'app-conteudo app-conteudo-cheio' : 'app-conteudo'}>
        <Routes>
          <Route
            path="/"
            element={
              <RotaPrivada>
                <Dashboard />
              </RotaPrivada>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/sobre" element={<Sobre />} />
          {}
          <Route path="*" element={<NaoEncontrada />} />
        </Routes>
      </main>
    </div>
  );
}
export default App;
