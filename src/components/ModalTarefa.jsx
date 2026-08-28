import { useEffect, useRef, useState } from 'react';
import styles from './ModalTarefa.module.css';
import { consultarEndereco, montarLocalizacao } from '../services/viaCep';
import { mascararCep } from '../services/mascaras';

// Rótulo do campo de atividade muda conforme a coluna — é a mesma
// palavra "atividade" combinada com o particípio de cada coluna.
const LABEL_ATIVIDADE = {
  afazer: 'Atividade a fazer',
  andamento: 'Atividade em andamento',
  concluido: 'Atividade concluída',
};

const OPCOES_PRIORIDADE = [
  { valor: 'baixa', rotulo: 'Baixa' },
  { valor: 'media', rotulo: 'Média' },
  { valor: 'alta', rotulo: 'Alta' },
];

// tarefa = null   → modal em modo CRIAÇÃO
// tarefa = objeto → modal em modo EDIÇÃO (campos preenchidos)
// coluna          → em qual coluna a tarefa nasce (só importa na criação;
//                    na edição, a tarefa mantém a coluna que já tinha)
function ModalTarefa({ aberto, onFechar, onSalvar, tarefa = null, coluna = 'afazer' }) {
  const [nome, setNome] = useState('');
  const [atividade, setAtividade] = useState('');
  const [prioridade, setPrioridade] = useState('media');
  const [cep, setCep] = useState('');
  const [localizacaoAtual, setLocalizacaoAtual] = useState(null); // o que já está salvo (modo edição)
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Em edição a tarefa mantém a coluna que já tinha; em criação é a
  // coluna onde o usuário clicou no "+". É essa coluna "efetiva" que
  // decide o rótulo do campo de atividade.
  const colunaEfetiva = tarefa?.coluna || coluna;
  const labelAtividade = LABEL_ATIVIDADE[colunaEfetiva] || 'Atividade';

  // Preenche os campos toda vez que o modal abre — seja pra criar
  // (tarefa null → campos vazios) ou editar (tarefa preenchida).
  useEffect(() => {
    if (!aberto) return;
    if (tarefa) {
      setNome(tarefa.nome || '');
      setAtividade(tarefa.atividade || '');
      setPrioridade(tarefa.prioridade || 'media');
      setLocalizacaoAtual(tarefa.localizacao || null);
    } else {
      setNome('');
      setAtividade('');
      setPrioridade('media');
      setLocalizacaoAtual(null);
    }
    setCep(''); // CEP sempre começa vazio — só é usado se o usuário digitar um novo
  }, [tarefa, aberto]);

  // Fechar com Esc — useEffect + addEventListener, com cleanup pra não
  // acumular listeners toda vez que o modal reabre.
  useEffect(() => {
    if (!aberto) return;

    function handleEsc(evento) {
      if (evento.key === 'Escape') onFechar();
    }

    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [aberto, onFechar]);

  const cepExibido = mascararCep(cep);

  const handleCepChange = (evento) => {
    const somenteNumeros = evento.target.value.replace(/\D/g, '').slice(0, 8);
    setCep(somenteNumeros);
  };

  const handleSalvar = async () => {
    const nomeLimpo = nome.trim();
    const atividadeLimpa = atividade.trim();
    if (nomeLimpo === '' || atividadeLimpa === '') return; // validação: não salva sem nome/atividade

    setSalvando(true);
    setBuscandoCep(cep.length === 8);

    // Só busca um novo endereço se o usuário digitou um CEP completo
    // neste modal — senão mantém a localização que a tarefa já tinha
    // (editar o nome não deveria apagar o endereço salvo antes).
    let localizacaoFinal = localizacaoAtual;
    if (cep.length === 8) {
      const endereco = await consultarEndereco(cep);
      localizacaoFinal = montarLocalizacao(endereco);
    }

    onSalvar({
      id: tarefa?.id, // undefined = criar | existente = editar
      nome: nomeLimpo,
      atividade: atividadeLimpa,
      prioridade,
      localizacao: localizacaoFinal,
      coluna: colunaEfetiva,
    });

    setSalvando(false);
    setBuscandoCep(false);
    onFechar();
  };

  // Clique dentro do card não deve fechar o modal — só o clique no
  // overlay (fora do card) ou no botão Cancelar/X.
  const pararPropagacao = (evento) => evento.stopPropagation();

  if (!aberto) return null;

  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.card} onClick={pararPropagacao}>
        <h2>{tarefa ? 'Editar tarefa' : 'Nova tarefa'}</h2>

        <input
          className={styles.input}
          type="text"
          placeholder="Nome da pessoa"
          value={nome}
          autoFocus
          onChange={(evento) => setNome(evento.target.value)}
          onKeyDown={(evento) => evento.key === 'Enter' && handleSalvar()}
        />

        <input
          className={styles.input}
          type="text"
          placeholder={labelAtividade}
          value={atividade}
          onChange={(evento) => setAtividade(evento.target.value)}
          onKeyDown={(evento) => evento.key === 'Enter' && handleSalvar()}
        />

        <label className={styles.labelPrioridade}>
          Prioridade
          <select
            className={styles.input}
            value={prioridade}
            onChange={(evento) => setPrioridade(evento.target.value)}
          >
            {OPCOES_PRIORIDADE.map((opcao) => (
              <option key={opcao.valor} value={opcao.valor}>
                {opcao.rotulo}
              </option>
            ))}
          </select>
        </label>

        <input
          className={styles.input}
          type="text"
          inputMode="numeric"
          placeholder="00000-000"
          value={cepExibido}
          onChange={handleCepChange}
          onKeyDown={(evento) => evento.key === 'Enter' && handleSalvar()}
        />

        {/* Enquanto o usuário não digita um CEP novo, mostra o endereço
            que a tarefa já tem (só existe em modo edição). */}
        {cep.length < 8 && localizacaoAtual && (
          <p className={styles.localizacao}>📍 {localizacaoAtual}</p>
        )}
        {buscandoCep && <p className={styles.localizacao}>Buscando endereço...</p>}

        <div className={styles.botoes}>
          <button type="button" className={styles.btnCancelar} onClick={onFechar}>
            Cancelar
          </button>
          <button type="button" className={styles.btnSalvar} onClick={handleSalvar} disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalTarefa;
