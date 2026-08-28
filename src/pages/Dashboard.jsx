import { useEffect, useState } from 'react';
import Header from '../components/Header';
import QuadroKanban from '../components/QuadroKanban';
import ModalTarefa from '../components/ModalTarefa';
import Rodape from '../components/Rodape';

// Cada tarefa vive numa das 3 colunas (A Fazer → Em Andamento →
// Concluído) — ORDEM_COLUNAS é a única fonte de verdade sobre qual
// coluna vem antes/depois de qual; moverTarefa só anda +1/-1 nela.
const ORDEM_COLUNAS = ['afazer', 'andamento', 'concluido'];

// Tarefas de exemplo — só usadas na primeiríssima vez que o app abre,
// quando ainda não existe nada salvo no localStorage.
const TAREFAS_INICIAIS = [
  { id: crypto.randomUUID(), nome: 'Ana Lima', coluna: 'afazer', localizacao: null },
  { id: crypto.randomUUID(), nome: 'Carlos Souza', coluna: 'andamento', localizacao: null },
  { id: crypto.randomUUID(), nome: 'Beatriz Alves', coluna: 'afazer', localizacao: null },
  { id: crypto.randomUUID(), nome: 'Diego Ramos', coluna: 'concluido', localizacao: null },
];

// Lê o localStorage UMA vez, na inicialização. Passar uma função pro
// useState (em vez de chamar carregarTarefasSalvas() direto) é o padrão
// de "lazy initial state" — o React só executa essa função no primeiro
// render, não em todo re-render do componente.
function carregarTarefasSalvas() {
  const salvo = localStorage.getItem('tarefas');
  return salvo ? JSON.parse(salvo) : TAREFAS_INICIAIS;
}

function Dashboard() {
  const [tarefas, setTarefas] = useState(carregarTarefasSalvas);

  // Estado do modal: se está aberto, qual tarefa está sendo editada
  // (null = criando uma nova) e em qual coluna a criação deve nascer.
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState('afazer');

  // Mantém as tarefas (com suas colunas) persistidas mesmo após
  // atualizar ou fechar a página. Toda alteração no estado de tarefas
  // gera uma nova gravação no navegador — incluindo mudança de coluna.
  useEffect(() => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
  }, [tarefas]);

  // Melhoria — contador de tarefas pendentes no título da aba. Roda
  // toda vez que "tarefas" muda, pra sempre refletir o estado real
  // (com [] rodaria só uma vez e o título ficaria desatualizado).
  useEffect(() => {
    const pendentes = tarefas.filter((tarefa) => tarefa.coluna === 'afazer').length;
    document.title = pendentes > 0 ? `(${pendentes}) TaskFlow` : 'TaskFlow';
  }, [tarefas]);

  const abrirModalCriar = (coluna) => {
    setTarefaEditando(null); // null = modo criação
    setColunaAtiva(coluna);
    setModalAberto(true);
  };

  const abrirModalEditar = (tarefa) => {
    setTarefaEditando(tarefa); // objeto = modo edição
    setModalAberto(true);
  };

  const fecharModal = () => setModalAberto(false);

  // Uma função só cobre os dois casos: se "dados.id" existe, a tarefa
  // já existia (edita, sem mudar de coluna — mantém a que já tinha);
  // se não existe, é uma tarefa nova (cria com um id gerado agora).
  const salvarTarefa = (dados) => {
    if (dados.id) {
      setTarefas((atual) =>
        atual.map((tarefa) => (tarefa.id === dados.id ? { ...tarefa, ...dados } : tarefa)),
      );
    } else {
      setTarefas((atual) => [...atual, { ...dados, id: crypto.randomUUID() }]);
    }
  };

  // Melhoria — confirmar antes de deletar. window.confirm() é uma
  // janela nativa do navegador: true se o usuário clicou OK, false se
  // cancelou ou fechou. Só deleta se confirmado.
  const deletarTarefa = (id) => {
    const confirmado = window.confirm('Tem certeza que deseja deletar esta tarefa?');
    if (confirmado) {
      setTarefas((atual) => atual.filter((tarefa) => tarefa.id !== id));
    }
  };

  // Move uma tarefa uma posição pra frente (direcao = 1, botão →) ou
  // uma posição pra trás (direcao = -1, botão ←) na ORDEM_COLUNAS.
  const moverTarefa = (id, direcao) => {
    setTarefas((atual) =>
      atual.map((tarefa) => {
        if (tarefa.id !== id) return tarefa;
        const indiceAtual = ORDEM_COLUNAS.indexOf(tarefa.coluna);
        const novoIndice = indiceAtual + direcao;
        if (novoIndice < 0 || novoIndice >= ORDEM_COLUNAS.length) return tarefa;
        return { ...tarefa, coluna: ORDEM_COLUNAS[novoIndice] };
      }),
    );
  };

  // Arrastar e soltar: a mesma função cobre tanto reordenar dentro da
  // MESMA coluna quanto mover pra outra coluna.
  // - colunaDestino: em qual coluna a tarefa deve ficar (sempre a
  //   coluna onde o usuário soltou).
  // - idDestino: sobre qual tarefa foi solta (null quando foi solta no
  //   espaço vazio da coluna — nesse caso, a tarefa vai pro final).
  const moverArrastando = (idOrigem, colunaDestino, idDestino) => {
    setTarefas((atual) => {
      const indiceOrigem = atual.findIndex((tarefa) => tarefa.id === idOrigem);
      if (indiceOrigem === -1) return atual;

      const copia = [...atual];
      const [tarefaMovida] = copia.splice(indiceOrigem, 1);
      tarefaMovida.coluna = colunaDestino;

      const indiceDestino = idDestino ? copia.findIndex((tarefa) => tarefa.id === idDestino) : -1;
      if (indiceDestino !== -1) {
        copia.splice(indiceDestino, 0, tarefaMovida);
      } else {
        copia.push(tarefaMovida); // solto no vazio da coluna: vai pro final
      }
      return copia;
    });
  };

  // Bônus — limpar todas as tarefas de uma coluna de uma vez.
  const limparColuna = (colunaChave) => {
    const confirmado = window.confirm('Deletar todas as tarefas desta coluna?');
    if (confirmado) {
      setTarefas((atual) => atual.filter((tarefa) => tarefa.coluna !== colunaChave));
    }
  };

  return (
    <div id="app">
      <Header titulo="TaskFlow" subtitulo="Gerencie suas tarefas em um quadro Kanban" />

      <main className="container">
        <QuadroKanban
          tarefas={tarefas}
          aoMover={moverTarefa}
          aoDeletar={deletarTarefa}
          aoAbrirCriar={abrirModalCriar}
          aoAbrirEditar={abrirModalEditar}
          aoArrastarSoltar={moverArrastando}
          aoLimparColuna={limparColuna}
        />
      </main>

      <Rodape />

      <ModalTarefa
        aberto={modalAberto}
        onFechar={fecharModal}
        onSalvar={salvarTarefa}
        tarefa={tarefaEditando}
        coluna={colunaAtiva}
      />
    </div>
  );
}

export default Dashboard;
