import styles from './TarefaItem.module.css';

const ROTULO_PRIORIDADE = { baixa: 'Baixa', media: 'Média', alta: 'Alta' };
const CLASSE_PRIORIDADE = { baixa: styles.prioridadeBaixa, media: styles.prioridadeMedia, alta: styles.prioridadeAlta };

// Duplo clique no card abre o ModalTarefa (em modo edição, já com os
// dados preenchidos) — não existe mais edição de texto direto no card,
// isso é responsabilidade só do modal agora.
function TarefaItem({
  tarefa,
  arrastando,
  aoDeletar,
  aoEditar,
  aoIniciarArraste,
  aoTerminarArraste,
  aoSoltar,
  // Props OPCIONAIS de Kanban — só existem quando TarefaItem é usada
  // dentro de uma coluna do quadro. Se não vierem (undefined), os
  // botões de mover simplesmente não aparecem, sem quebrar nada.
  aoMoverEsquerda,
  aoMoverDireita,
}) {
  const { id, nome, atividade, prioridade, localizacao, coluna } = tarefa;

  const classeLi = [
    styles.tarefa,
    coluna === 'concluido' ? styles.concluida : '',
    arrastando ? styles.arrastando : '',
  ].filter(Boolean).join(' ');

  return (
    <li
      className={classeLi}
      draggable
      onDragStart={aoIniciarArraste}
      onDragOver={(evento) => evento.preventDefault()} // obrigatório pro drop funcionar
      onDrop={aoSoltar}
      onDragEnd={aoTerminarArraste}
      onDoubleClick={() => aoEditar(tarefa)}
      title="Duplo clique para editar"
    >
      {/* aoMoverEsquerda só existe se esta NÃO for a primeira coluna —
          quem decide isso é o QuadroKanban, aqui só reagimos à presença
          ou ausência da prop. */}
      {aoMoverEsquerda && (
        <button
          type="button"
          className={styles.btnMover}
          onClick={(evento) => { evento.stopPropagation(); aoMoverEsquerda(); }}
          title="Mover para a coluna anterior"
        >
          ←
        </button>
      )}

      <div className={styles.conteudoTexto}>
        <div className={styles.linhaTopo}>
          <span className={styles.nomePessoa}>{nome}</span>
          {/* Prioridade só aparece se a tarefa tiver uma — tarefas criadas
              antes desse campo existir (localStorage antigo) simplesmente
              não mostram o selo. */}
          {prioridade && (
            <span className={`${styles.prioridade} ${CLASSE_PRIORIDADE[prioridade] || ''}`}>
              {ROTULO_PRIORIDADE[prioridade] || prioridade}
            </span>
          )}
        </div>
        {/* Atividade é o que a pessoa precisa fazer — mesmo campo pra
            todas as colunas, só o rótulo no modal muda (ModalTarefa). */}
        {atividade && <span className={styles.atividade}>{atividade}</span>}
        {/* Localização só aparece se a tarefa tiver uma (CEP informado e
            encontrado pelo ViaCEP) — não ocupa espaço quando não existe. */}
        {localizacao && <span className={styles.localizacao}>📍 {localizacao}</span>}
      </div>

      <button
        type="button"
        className={styles.btnDeletar}
        onClick={(evento) => { evento.stopPropagation(); aoDeletar(id); }}
      >
        ✕
      </button>

      {aoMoverDireita && (
        <button
          type="button"
          className={styles.btnMover}
          onClick={(evento) => { evento.stopPropagation(); aoMoverDireita(); }}
          title="Mover para a próxima coluna"
        >
          →
        </button>
      )}
    </li>
  );
}

export default TarefaItem;
