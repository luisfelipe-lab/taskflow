// ==================================================
// [TaskFlow] — Página Sobre (v1.0)
// ==================================================

import './Sobre.css';
function Sobre() {
  return (
    <main className="sobre-container">
      <h1>Sobre o TaskFlow</h1>
      <p>
        TaskFlow é um quadro Kanban para organizar tarefas em três colunas — A Fazer, Em Andamento e
        Concluído — com criação e edição pelo modal, busca automática de endereço por CEP e tudo
        salvo no navegador, mesmo depois de recarregar a página.
      </p>

      <h2>Tecnologias usadas</h2>
      <ul>
        <li>React</li>
        <li>Vite</li>
        <li>Axios</li>
        <li>React Router</li>
      </ul>

      <h2>Desenvolvedor</h2>
      <p>Luis Felipe Dantas da Costa — SENAI CTGAS-ER, Programador Full Stack</p>
    </main>
  );
}
export default Sobre;
