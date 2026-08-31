// ==================================================
// [TaskFlow] — Componente Lista de Tarefas (v1.0)
// ==================================================

import TarefaItem from './TarefaItem';
function ListaTarefas({
  tarefas,
  colunaAtual,
  idArrastado,
  aoIniciarArraste,
  aoTerminarArraste,
  aoDeletar,
  aoEditar,
  aoArrastarSoltar,
  aoMoverEsquerda,
  aoMoverDireita,
}) {
  return (
    <>
      {}
      {tarefas.length === 0 && <p className="msg-vazia">Nenhuma tarefa aqui.</p>}

      {}
      {tarefas.length > 0 && (
        <ul className="lista-tarefas">
          {tarefas.map((tarefa) => (
            <TarefaItem
              key={tarefa.id}
              tarefa={tarefa}
              arrastando={idArrastado === tarefa.id}
              aoDeletar={aoDeletar}
              aoEditar={aoEditar}
              aoIniciarArraste={() => aoIniciarArraste(tarefa.id)}
              aoTerminarArraste={aoTerminarArraste}
              aoSoltar={(evento) => {
                evento.stopPropagation();
                if (idArrastado !== null && idArrastado !== tarefa.id) {
                  aoArrastarSoltar(idArrastado, colunaAtual, tarefa.id);
                }
              }}
              aoMoverEsquerda={aoMoverEsquerda ? () => aoMoverEsquerda(tarefa.id) : null}
              aoMoverDireita={aoMoverDireita ? () => aoMoverDireita(tarefa.id) : null}
            />
          ))}
        </ul>
      )}
    </>
  );
}
export default ListaTarefas;
