import { Link } from 'react-router-dom';

// Rota curinga (path="*" no App.jsx) — captura qualquer URL que não
// corresponda a nenhuma das rotas cadastradas.
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
