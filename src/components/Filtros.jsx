// ==================================================
// [TaskFlow] — Componente Filtros (v1.0)
// ==================================================

const OPCOES_FILTRO = [
  {
    valor: 'todas',
    rotulo: 'Todas',
  },
  {
    valor: 'pendentes',
    rotulo: 'Pendentes',
  },
  {
    valor: 'concluidas',
    rotulo: 'Concluídas',
  },
];
function Filtros({ filtroAtivo, aoMudarFiltro }) {
  return (
    <div id="filtros">
      {OPCOES_FILTRO.map((opcao) => (
        <button
          key={opcao.valor}
          type="button"
          className={opcao.valor === filtroAtivo ? 'btn-filtro ativo' : 'btn-filtro'}
          onClick={() => aoMudarFiltro(opcao.valor)}
        >
          {opcao.rotulo}
        </button>
      ))}
    </div>
  );
}
export default Filtros;
