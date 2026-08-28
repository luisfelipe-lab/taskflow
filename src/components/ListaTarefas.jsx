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
      {/* Mensagem quando não há tarefas nesta coluna */}
      {tarefas.length === 0 && (
        <p className="msg-vazia">Nenhuma tarefa aqui.</p>
      )}

      {/* Lista renderizada dinamicamente com .map() — key={tarefa.id},
          nunca o índice, porque o índice muda quando um item é
          removido, reordenado ou movido de coluna. */}
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
                // Impede que o evento suba até o <section> da coluna
                // (QuadroKanban) — sem isso, soltar sobre um item
                // também disparia o drop "no vazio" da coluna.
                evento.stopPropagation();
                if (idArrastado !== null && idArrastado !== tarefa.id) {
                  aoArrastarSoltar(idArrastado, colunaAtual, tarefa.id);
                }
              }}
              // Repassa as props de Kanban recebidas do QuadroKanban,
              // já "fechadas" (via closure) sobre o id desta tarefa —
              // TarefaItem só precisa saber chamar a função, não sobre
              // qual id ela se aplica.
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
