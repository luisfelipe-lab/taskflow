// Cache simples em localStorage: se o mesmo CEP já foi buscado antes
// (ex: o cliente digitou errado e depois corrigiu de volta pro valor
// original), reaproveita o resultado em vez de chamar o ViaCEP de novo.
const CHAVE = 'cache-cep';

function lerCache() {
  const salvo = localStorage.getItem(CHAVE);
  return salvo ? JSON.parse(salvo) : {};
}

export function obterCepDoCache(cep) {
  const cache = lerCache();
  return cache[cep] || null;
}

export function salvarCepNoCache(cep, dados) {
  const cache = lerCache();
  cache[cep] = dados;
  localStorage.setItem(CHAVE, JSON.stringify(cache));
}
