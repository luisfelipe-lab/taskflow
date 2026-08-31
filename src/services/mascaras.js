// ==================================================
// [TaskFlow] — Utilitário de Máscaras de Input (v1.0)
// ==================================================

export function mascararCep(valor) {
  return (valor || '')
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, '$1-$2');
}
export function mascararTelefone(valor) {
  const numeros = (valor || '').replace(/\D/g, '').slice(0, 11);
  if (numeros.length <= 10) {
    return numeros.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
  }
  return numeros.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
}
export function calcularForcaSenha(senha) {
  if (!senha)
    return {
      nivel: 0,
      rotulo: '',
    };
  let pontos = 0;
  if (senha.length >= 6) pontos += 1;
  if (senha.length >= 10) pontos += 1;
  if (/[A-Z]/.test(senha) && /[a-z]/.test(senha)) pontos += 1;
  if (/\d/.test(senha)) pontos += 1;
  if (/[^A-Za-z0-9]/.test(senha)) pontos += 1;
  if (pontos <= 1)
    return {
      nivel: 1,
      rotulo: 'Fraca',
    };
  if (pontos <= 3)
    return {
      nivel: 2,
      rotulo: 'Média',
    };
  return {
    nivel: 3,
    rotulo: 'Forte',
  };
}
