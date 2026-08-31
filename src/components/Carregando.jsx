// ==================================================
// [TaskFlow] — Componente de Carregamento (3 pontinhos) (v1.0)
// ==================================================

import styles from './Carregando.module.css';
function Carregando({ mensagem }) {
  return (
    <div className={styles.container}>
      <div className={styles.pontinhos}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
    </div>
  );
}
export default Carregando;
