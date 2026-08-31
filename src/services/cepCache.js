// ==================================================
// [TaskFlow] — Cache de Consultas de CEP (v1.0)
// ==================================================

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
