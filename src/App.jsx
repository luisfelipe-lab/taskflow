import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import RotaPrivada from './components/RotaPrivada';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Sobre from './pages/Sobre';
import NaoEncontrada from './pages/NaoEncontrada';

// App só cuida de layout e rotas — nada de estado de autenticação
// aqui (isso vive no AuthContext, consumido via useAuth() por quem
// precisar). A Sidebar fica FORA do <Routes>, então aparece em todas
// as páginas sem ser remontada quando a rota muda — EXCETO na página
// de login, que fica sozinha na tela (sem o link "Sobre" nem o resto
// da navegação, que não fazem sentido antes de o usuário estar logado).
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
          {/* Rota curinga — qualquer URL não mapeada cai na página 404 */}
          <Route path="*" element={<NaoEncontrada />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
