import { useState } from 'react';
import ListaTarefas from './ListaTarefas';

// A ordem das colunas é a mesma ordem em que elas aparecem na tela E a
// mesma ordem usada por moverTarefa (no Dashboard) pra saber se
// "direita" ou "esquerda" é um índice válido. As três coisas — visual,
// dado (tarefa.coluna) e navegação (←/→) — usam exatamente estas chaves.
const COLUNAS = [
  { chave: 'afazer', titulo: 'A Fazer' },
  { chave: 'andamento', titulo: 'Em Andamento' },
  { chave: 'concluido', titulo: 'Concluído' },
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
  // Qual tarefa está sendo arrastada agora vive AQUI (no quadro todo),
  // não em cada coluna — é o que permite arrastar uma tarefa de uma
  // coluna e soltar em outra, e não só reordenar dentro da mesma lista.
  const [idArrastado, setIdArrastado] = useState(null);

  return (
    <div className="kanban">
      {COLUNAS.map((coluna, indice) => {
        const tarefasDaColuna = tarefas.filter((tarefa) => tarefa.coluna === coluna.chave);
        return (
          <section
            key={coluna.chave}
            className="kanban-coluna"
            onDragOver={(evento) => evento.preventDefault()} // obrigatório pro drop funcionar
            onDrop={() => {
              // Só chega aqui se o drop NÃO foi capturado por um
              // TarefaItem específico (que dá stopPropagation) — ou
              // seja, o usuário soltou no espaço vazio da coluna. Nesse
              // caso a tarefa vai pro final desta coluna.
              if (idArrastado !== null) {
                aoArrastarSoltar(idArrastado, coluna.chave, null);
              }
            }}
          >
            <header className="kanban-coluna-cabecalho">
              <h2>{coluna.titulo}</h2>
              <div className="kanban-coluna-acoes">
                {/* Contador de tarefas por coluna */}
                <span className="kanban-contador">{tarefasDaColuna.length}</span>
                {/* Limpar coluna — desafio extra, só aparece com tarefas */}
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
                {/* Botão + abre o modal já com esta coluna pré-selecionada */}
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
              // A primeira coluna não tem "esquerda"; a última não tem
              // "direita" — por isso passamos null nessas pontas, e o
              // TarefaItem já sabe não desenhar o botão quando recebe null.
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
