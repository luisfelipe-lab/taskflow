import axios from 'axios';
import { obterCepDoCache, salvarCepNoCache } from './cepCache';

// ViaCEP é uma API pública real, gratuita e sem necessidade de chave —
// por isso essa parte funciona de verdade, diferente da busca por CPF.
// Documentação: https://viacep.com.br
//
// Antes de chamar a API, verifica se esse CEP já foi buscado antes
// (guardado no localStorage) e reaproveita o resultado — evita repetir
// a mesma requisição de rede se o cliente digitar o CEP errado e voltar
// pro mesmo valor.
export function buscarEnderecoPorCep(cep) {
  const doCache = obterCepDoCache(cep);
  if (doCache) {
    // Devolve no mesmo formato que o axios devolveria ({ data }), pra
    // quem chama essa função não precisar saber se veio do cache ou da rede.
    return Promise.resolve({ data: doCache });
  }

  return axios.get(`https://viacep.com.br/ws/${cep}/json/`).then((resposta) => {
    if (!resposta.data.erro) {
      salvarCepNoCache(cep, resposta.data);
    }
    return resposta;
  });
}

// consultarCidade: mantida por compatibilidade — devolve só o nome da
// cidade (ou null se o CEP não existir/falhar).
export async function consultarCidade(cep) {
  const endereco = await consultarEndereco(cep);
  return endereco ? endereco.cidade : null;
}

// consultarEndereco: usada pelo formulário de tarefas. Recebe só o CEP
// e devolve { cidade, bairro, rua } — bairro e rua vêm null quando o
// próprio ViaCEP não os retorna para aquele CEP (alguns CEPs genéricos
// de cidade não têm logradouro/bairro associado). O chamador decide
// como exibir isso (só cidade, ou cidade + bairro + rua).
export async function consultarEndereco(cep) {
  try {
    const resposta = await buscarEnderecoPorCep(cep);
    if (resposta.data.erro) return null; // ViaCEP devolve { erro: true } pra CEP inexistente
    const { localidade, bairro, logradouro } = resposta.data;
    if (!localidade) return null;
    return {
      cidade: localidade,
      bairro: bairro || null,
      rua: logradouro || null,
    };
  } catch {
    return null; // falha de rede — a tarefa ainda assim é criada, só sem localização
  }
}

// montarLocalizacao: transforma o objeto { cidade, bairro, rua } numa
// única string pronta pra exibir na tarefa. Se o ViaCEP não devolveu
// bairro/rua para aquele CEP (alguns CEPs "genéricos" de cidade não
// têm), cai graciosamente pra um formato mais curto.
export function montarLocalizacao(endereco) {
  if (!endereco) return null;
  const { cidade, bairro, rua } = endereco;
  if (rua && bairro) return `${rua}, ${bairro} - ${cidade}`;
  if (bairro) return `${bairro} - ${cidade}`;
  return cidade;
}
