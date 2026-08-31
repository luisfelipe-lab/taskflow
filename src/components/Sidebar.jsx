// ==================================================
// [TaskFlow] — Componente Sidebar (v1.0)
// ==================================================

import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Sidebar.module.css';
function Sidebar() {
  const { logado, logout } = useAuth();
  const linkClass = ({ isActive }) => (isActive ? `${styles.link} ${styles.ativo}` : styles.link);
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h1>TaskFlow</h1>
      </div>

      <nav className={styles.nav}>
        {}
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
