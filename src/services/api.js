// ==================================================
// [TaskFlow] — Serviço de Comunicação com a API (v1.0)
// ==================================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const CHAVE_TOKEN = 'taskflow_token';
export function getToken() {
  return localStorage.getItem(CHAVE_TOKEN);
}
export function setToken(token) {
  localStorage.setItem(CHAVE_TOKEN, token);
}
export function clearToken() {
  localStorage.removeItem(CHAVE_TOKEN);
}
function headersComToken() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}
async function tratarResposta(resposta) {
  const dados = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    throw new Error(dados?.erro || `Erro ${resposta.status} ao falar com a API`);
  }
  return dados;
}
async function tratarRespostaProtegida(resposta) {
  if (resposta.status === 401) {
    clearToken();
    window.dispatchEvent(new Event('taskflow:sessao-expirada'));
  }
  return tratarResposta(resposta);
}
async function envolverErroDeRede(promessaFetch) {
  try {
    return await promessaFetch;
  } catch (erro) {
    if (erro instanceof TypeError) {
      throw new Error(
        'Não foi possível conectar à API. Verifique se o servidor da taskflow-api está rodando (npm run dev).',
      );
    }
    throw erro;
  }
}
export async function listarTarefas() {
  const resposta = await envolverErroDeRede(
    fetch(`${API_URL}/tarefas`, {
      headers: headersComToken(),
    }),
  );
  return tratarRespostaProtegida(resposta);
}
export async function criarTarefa(dados) {
  const resposta = await envolverErroDeRede(
    fetch(`${API_URL}/tarefas`, {
      method: 'POST',
      headers: headersComToken(),
      body: JSON.stringify(dados),
    }),
  );
  return tratarRespostaProtegida(resposta);
}
export async function atualizarTarefa(id, dados) {
  const resposta = await envolverErroDeRede(
    fetch(`${API_URL}/tarefas/${id}`, {
      method: 'PUT',
      headers: headersComToken(),
      body: JSON.stringify(dados),
    }),
  );
  return tratarRespostaProtegida(resposta);
}
export async function removerTarefa(id) {
  const resposta = await envolverErroDeRede(
    fetch(`${API_URL}/tarefas/${id}`, {
      method: 'DELETE',
      headers: headersComToken(),
    }),
  );
  return tratarRespostaProtegida(resposta);
}
export async function fazerLogin(usuario, senha) {
  const resposta = await envolverErroDeRede(
    fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usuario,
        senha,
      }),
    }),
  );
  return tratarResposta(resposta);
}
