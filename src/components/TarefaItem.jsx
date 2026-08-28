import styles from './TarefaItem.module.css';

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
  const { id, nome, localizacao, coluna } = tarefa;

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
        <span className={styles.nomePessoa}>{nome}</span>
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
