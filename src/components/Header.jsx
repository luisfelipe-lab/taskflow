// Header voltou a ser simples: só título e subtítulo. Não existe mais
// um "cliente" global logado — cada tarefa agora carrega seu próprio
// nome de pessoa, exibido no TarefaItem, não aqui.
function Header({ titulo, subtitulo }) {
  return (
    <header className="header">
      <div className="logo">
        <h1>{titulo}</h1>
        <p>{subtitulo}</p>
      </div>
    </header>
  );
}

export default Header;
