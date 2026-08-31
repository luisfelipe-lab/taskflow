// ==================================================
// [TaskFlow] — Serviço ViaCEP (v1.0)
// ==================================================

import axios from 'axios';
import { obterCepDoCache, salvarCepNoCache } from './cepCache';
export function buscarEnderecoPorCep(cep) {
  const doCache = obterCepDoCache(cep);
  if (doCache) {
    return Promise.resolve({
      data: doCache,
    });
  }
  return axios.get(`https://viacep.com.br/ws/${cep}/json/`).then((resposta) => {
    if (!resposta.data.erro) {
      salvarCepNoCache(cep, resposta.data);
    }
    return resposta;
  });
}
export async function consultarCidade(cep) {
  const endereco = await consultarEndereco(cep);
  return endereco ? endereco.cidade : null;
}
export async function consultarEndereco(cep) {
  try {
    const resposta = await buscarEnderecoPorCep(cep);
    if (resposta.data.erro) return null;
    const { localidade, bairro, logradouro } = resposta.data;
    if (!localidade) return null;
    return {
      cidade: localidade,
      bairro: bairro || null,
      rua: logradouro || null,
    };
  } catch {
    return null;
  }
}
export function montarLocalizacao(endereco) {
  if (!endereco) return null;
  const { cidade, bairro, rua } = endereco;
  if (rua && bairro) return `${rua}, ${bairro} - ${cidade}`;
  if (bairro) return `${bairro} - ${cidade}`;
  return cidade;
}
