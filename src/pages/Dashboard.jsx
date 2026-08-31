// ==================================================
// [TaskFlow] — Página Dashboard (v1.0)
// ==================================================

import { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import QuadroKanban from '../components/QuadroKanban';
import ModalTarefa from '../components/ModalTarefa';
import Rodape from '../components/Rodape';
import Carregando from '../components/Carregando';
import { listarTarefas, criarTarefa, atualizarTarefa, removerTarefa } from '../services/api';
const ORDEM_COLUNAS = ['afazer', 'andamento', 'concluido'];
const LIMITE_REDE_LENTA_MS = 4000;
function Dashboard() {
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [redeLenta, setRedeLenta] = useState(false);
  const [erro, setErro] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState('afazer');
  const timerRedeLentaRef = useRef(null);
  const carregarTarefas = () => {
    setCarregando(true);
    setRedeLenta(false);
    setErro('');
    timerRedeLentaRef.current = setTimeout(() => setRedeLenta(true), LIMITE_REDE_LENTA_MS);
    listarTarefas()
      .then(setTarefas)
      .catch((erroApi) => setErro(erroApi.message))
      .finally(() => {
        clearTimeout(timerRedeLentaRef.current);
        setCarregando(false);
        setRedeLenta(false);
      });
  };
  useEffect(() => {
    carregarTarefas();
    return () => clearTimeout(timerRedeLentaRef.current);
  }, []);
  useEffect(() => {
    const pendentes = tarefas.filter((tarefa) => tarefa.coluna === 'afazer').length;
    document.title = pendentes > 0 ? `(${pendentes}) TaskFlow` : 'TaskFlow';
  }, [tarefas]);
  const abrirModalCriar = (coluna) => {
    setTarefaEditando(null);
    setColunaAtiva(coluna);
    setModalAberto(true);
  };
  const abrirModalEditar = (tarefa) => {
    setTarefaEditando(tarefa);
    setModalAberto(true);
  };
  const fecharModal = () => setModalAberto(false);
  const salvarTarefa = async (dados) => {
    try {
      if (dados.id) {
        const { id, ...corpo } = dados;
        const tarefaAtualizada = await atualizarTarefa(id, corpo);
        setTarefas((atual) =>
          atual.map((tarefa) => (tarefa.id === id ? tarefaAtualizada : tarefa)),
        );
      } else {
        const tarefaCriada = await criarTarefa(dados);
        setTarefas((atual) => [...atual, tarefaCriada]);
      }
    } catch (erroApi) {
      window.alert('Ocorreu um erro: ' + erroApi.message);
    }
  };
  const deletarTarefa = async (id) => {
    const confirmado = window.confirm('Tem certeza que deseja deletar esta tarefa?');
    if (!confirmado) return;
    try {
      await removerTarefa(id);
      setTarefas((atual) => atual.filter((tarefa) => tarefa.id !== id));
    } catch (erroApi) {
      window.alert('Ocorreu um erro: ' + erroApi.message);
    }
  };
  const moverTarefa = async (id, direcao) => {
    const tarefaAtual = tarefas.find((tarefa) => tarefa.id === id);
    if (!tarefaAtual) return;
    const indiceAtual = ORDEM_COLUNAS.indexOf(tarefaAtual.coluna);
    const novoIndice = indiceAtual + direcao;
    if (novoIndice < 0 || novoIndice >= ORDEM_COLUNAS.length) return;
    const { id: _id, ...corpo } = tarefaAtual;
    try {
      const tarefaAtualizada = await atualizarTarefa(id, {
        ...corpo,
        coluna: ORDEM_COLUNAS[novoIndice],
      });
      setTarefas((atual) => atual.map((tarefa) => (tarefa.id === id ? tarefaAtualizada : tarefa)));
    } catch (erroApi) {
      window.alert('Ocorreu um erro: ' + erroApi.message);
    }
  };
  const moverArrastando = async (idOrigem, colunaDestino, idDestino) => {
    const tarefaOrigem = tarefas.find((tarefa) => tarefa.id === idOrigem);
    if (!tarefaOrigem) return;
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
        copia.push(tarefaMovida);
      }
      return copia;
    });
    if (tarefaOrigem.coluna !== colunaDestino) {
      const { id: _id, ...corpo } = tarefaOrigem;
      try {
        await atualizarTarefa(idOrigem, {
          ...corpo,
          coluna: colunaDestino,
        });
      } catch (erroApi) {
        window.alert('Ocorreu um erro: ' + erroApi.message);
        carregarTarefas();
      }
    }
  };
  const limparColuna = async (colunaChave) => {
    const confirmado = window.confirm('Deletar todas as tarefas desta coluna?');
    if (!confirmado) return;
    const idsDaColuna = tarefas
      .filter((tarefa) => tarefa.coluna === colunaChave)
      .map((tarefa) => tarefa.id);
    try {
      await Promise.all(idsDaColuna.map((id) => removerTarefa(id)));
      setTarefas((atual) => atual.filter((tarefa) => tarefa.coluna !== colunaChave));
    } catch (erroApi) {
      window.alert('Ocorreu um erro: ' + erroApi.message);
      carregarTarefas();
    }
  };
  return (
    <div id="app">
      <Header titulo="TaskFlow" subtitulo="Gerencie suas tarefas em um quadro Kanban" />

      <main className="container">
        {carregando && (
          <Carregando mensagem={redeLenta ? 'Conexão lenta... aguarde um pouco mais.' : null} />
        )}

        {!carregando && erro && (
          <div className="mensagem-erro">
            <p>Ocorreu um erro ao carregar as tarefas.</p>
            <p className="mensagem-erro-detalhe">{erro}</p>
            <button type="button" onClick={carregarTarefas}>
              Tentar novamente
            </button>
          </div>
        )}

        {!carregando && !erro && (
          <QuadroKanban
            tarefas={tarefas}
            aoMover={moverTarefa}
            aoDeletar={deletarTarefa}
            aoAbrirCriar={abrirModalCriar}
            aoAbrirEditar={abrirModalEditar}
            aoArrastarSoltar={moverArrastando}
            aoLimparColuna={limparColuna}
          />
        )}
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
