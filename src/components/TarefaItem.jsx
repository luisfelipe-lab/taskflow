// ==================================================
// [TaskFlow] — Componente Item de Tarefa (v1.0)
// ==================================================

import styles from './TarefaItem.module.css';
const ROTULO_PRIORIDADE = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
};
const CLASSE_PRIORIDADE = {
  baixa: styles.prioridadeBaixa,
  media: styles.prioridadeMedia,
  alta: styles.prioridadeAlta,
};
function TarefaItem({
  tarefa,
  arrastando,
  aoDeletar,
  aoEditar,
  aoIniciarArraste,
  aoTerminarArraste,
  aoSoltar,
  aoMoverEsquerda,
  aoMoverDireita,
}) {
  const { id, nome, atividade, prioridade, localizacao, coluna } = tarefa;
  const classeLi = [
    styles.tarefa,
    coluna === 'concluido' ? styles.concluida : '',
    arrastando ? styles.arrastando : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <li
      className={classeLi}
      draggable
      onDragStart={aoIniciarArraste}
      onDragOver={(evento) => evento.preventDefault()}
      onDrop={aoSoltar}
      onDragEnd={aoTerminarArraste}
      onDoubleClick={() => aoEditar(tarefa)}
      title="Duplo clique para editar"
    >
      {}
      {aoMoverEsquerda && (
        <button
          type="button"
          className={styles.btnMover}
          onClick={(evento) => {
            evento.stopPropagation();
            aoMoverEsquerda();
          }}
          title="Mover para a coluna anterior"
        >
          ←
        </button>
      )}

      <div className={styles.conteudoTexto}>
        <div className={styles.linhaTopo}>
          <span className={styles.nomePessoa}>{nome}</span>
          {}
          {prioridade && (
            <span className={`${styles.prioridade} ${CLASSE_PRIORIDADE[prioridade] || ''}`}>
              {ROTULO_PRIORIDADE[prioridade] || prioridade}
            </span>
          )}
        </div>
        {}
        {atividade && <span className={styles.atividade}>{atividade}</span>}
        {}
        {localizacao && <span className={styles.localizacao}>📍 {localizacao}</span>}
      </div>

      <button
        type="button"
        className={styles.btnDeletar}
        onClick={(evento) => {
          evento.stopPropagation();
          aoDeletar(id);
        }}
      >
        ✕
      </button>

      {aoMoverDireita && (
        <button
          type="button"
          className={styles.btnMover}
          onClick={(evento) => {
            evento.stopPropagation();
            aoMoverDireita();
          }}
          title="Mover para a próxima coluna"
        >
          →
        </button>
      )}
    </li>
  );
}
export default TarefaItem;
