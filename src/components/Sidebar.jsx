import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Sidebar.module.css';

// Sidebar fica FORA do <Routes> (ver App.jsx) — por isso aparece em
// todas as páginas, sem ser remontada quando a rota muda.
function Sidebar() {
  const { logado, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.ativo}` : styles.link;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h1>TaskFlow</h1>
      </div>

      <nav className={styles.nav}>
        {/* Dashboard só aparece pra quem está logado — sem login, a
            rota / redireciona pra /login de qualquer forma, mas nem
            mostrar o link já deixa isso claro pro usuário. */}
        {logado && (
          <NavLink to="/" end className={linkClass}>
            Dashboard
          </NavLink>
        )}
        <NavLink to="/sobre" className={linkClass}>
          Sobre
        </NavLink>
      </nav>

      {logado && (
        <button type="button" className={styles.btnLogout} onClick={logout}>
          Sair
        </button>
      )}
    </aside>
  );
}

export default Sidebar;
