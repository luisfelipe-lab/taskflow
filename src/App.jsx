import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import RotaPrivada from './components/RotaPrivada';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Sobre from './pages/Sobre';
import NaoEncontrada from './pages/NaoEncontrada';

// App só cuida de layout e rotas — nada de estado de autenticação
// aqui (isso vive no AuthContext, consumido via useAuth() por quem
// precisar). A Sidebar fica FORA do <Routes>, então aparece em todas
// as páginas sem ser remontada quando a rota muda.
function App() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="app-conteudo">
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
          {/* Rota curinga — qualquer URL não mapeada cai na página 404 */}
          <Route path="*" element={<NaoEncontrada />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
