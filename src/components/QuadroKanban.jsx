// ==================================================
// [TaskFlow] — Componente Quadro Kanban (v1.0)
// ==================================================

import { useState } from 'react';
import ListaTarefas from './ListaTarefas';
const COLUNAS = [
  {
    chave: 'afazer',
    titulo: 'A Fazer',
  },
  {
    chave: 'andamento',
    titulo: 'Em Andamento',
  },
  {
    chave: 'concluido',
    titulo: 'Concluído',
  },
];
function QuadroKanban({
  tarefas,
  aoMover,
  aoDeletar,
  aoAbrirCriar,
  aoAbrirEditar,
  aoArrastarSoltar,
  aoLimparColuna,
}) {
  const [idArrastado, setIdArrastado] = useState(null);
  return (
    <div className="kanban">
      {COLUNAS.map((coluna, indice) => {
        const tarefasDaColuna = tarefas.filter((tarefa) => tarefa.coluna === coluna.chave);
        return (
          <section
            key={coluna.chave}
            className="kanban-coluna"
            onDragOver={(evento) => evento.preventDefault()}
            onDrop={() => {
              if (idArrastado !== null) {
                aoArrastarSoltar(idArrastado, coluna.chave, null);
              }
            }}
          >
            <header className="kanban-coluna-cabecalho">
              <h2>{coluna.titulo}</h2>
              <div className="kanban-coluna-acoes">
                {}
                <span className="kanban-contador">{tarefasDaColuna.length}</span>
                {}
                {tarefasDaColuna.length > 0 && (
                  <button
                    type="button"
                    className="kanban-btn-limpar"
                    title="Limpar todas as tarefas desta coluna"
                    onClick={() => aoLimparColuna(coluna.chave)}
                  >
                    🗑
                  </button>
                )}
                {}
                <button
                  type="button"
                  className="kanban-btn-add"
                  title="Nova tarefa nesta coluna"
                  onClick={() => aoAbrirCriar(coluna.chave)}
                >
                  +
                </button>
              </div>
            </header>

            <ListaTarefas
              tarefas={tarefasDaColuna}
              colunaAtual={coluna.chave}
              idArrastado={idArrastado}
              aoIniciarArraste={setIdArrastado}
              aoTerminarArraste={() => setIdArrastado(null)}
              aoDeletar={aoDeletar}
              aoEditar={aoAbrirEditar}
              aoArrastarSoltar={aoArrastarSoltar}
              aoMoverEsquerda={indice > 0 ? (id) => aoMover(id, -1) : null}
              aoMoverDireita={indice < COLUNAS.length - 1 ? (id) => aoMover(id, 1) : null}
            />
          </section>
        );
      })}
    </div>
  );
}
export default QuadroKanban;
