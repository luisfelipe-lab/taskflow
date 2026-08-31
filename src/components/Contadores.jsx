// ==================================================
// [TaskFlow] — Componente Contadores (v1.0)
// ==================================================

function Contadores({ total, pendentes, concluidas }) {
  return (
    <div id="contadores">
      <span>
        {total} {total === 1 ? 'tarefa' : 'tarefas'}
      </span>
      <span>
        {pendentes} {pendentes === 1 ? 'pendente' : 'pendentes'}
      </span>
      <span>
        {concluidas} {concluidas === 1 ? 'concluída' : 'concluídas'}
      </span>
    </div>
  );
}
export default Contadores;
