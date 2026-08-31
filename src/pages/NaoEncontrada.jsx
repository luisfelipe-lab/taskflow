// ==================================================
// [TaskFlow] — Página 404 (v1.0)
// ==================================================

import { Link } from 'react-router-dom';
function NaoEncontrada() {
  return (
    <main className="nao-encontrada">
      <h1>404</h1>
      <p>Página não encontrada.</p>
      <Link to="/">Voltar para o Dashboard</Link>
    </main>
  );
}
export default NaoEncontrada;
