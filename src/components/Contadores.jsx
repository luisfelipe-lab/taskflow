// Componente "burro": só recebe números prontos via props e exibe.
// Quem calcula total/pendentes/concluidas é o App — este componente
// não sabe nada sobre o array de tarefas, só sobre 3 números.
function Contadores({ total, pendentes, concluidas }) {
  return (
    <div id="contadores">
      <span>{total} {total === 1 ? 'tarefa' : 'tarefas'}</span>
      <span>{pendentes} {pendentes === 1 ? 'pendente' : 'pendentes'}</span>
      <span>{concluidas} {concluidas === 1 ? 'concluída' : 'concluídas'}</span>
    </div>
  );
}

export default Contadores;
