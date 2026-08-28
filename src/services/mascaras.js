// Máscaras visuais simples — sem depender de nenhuma lib externa.
// Recebem os números "crus" (já filtrados) e devolvem a string formatada
// que aparece pro usuário, mas quem guarda o estado continua guardando
// só os dígitos (mais fácil de validar e de mandar pra API).

export function mascararCep(valor) {
  return (valor || '')
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, '$1-$2');
}

// Aceita fixo (10 dígitos) e celular (11 dígitos, com o 9 na frente).
export function mascararTelefone(valor) {
  const numeros = (valor || '').replace(/\D/g, '').slice(0, 11);

  if (numeros.length <= 10) {
    return numeros
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

  return numeros
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

// Força da senha — sem API nenhuma, só regex. Devolve um nível de 0 a 4
// e um rótulo, pra desenhar a barrinha colorida no formulário.
export function calcularForcaSenha(senha) {
  if (!senha) return { nivel: 0, rotulo: '' };

  let pontos = 0;
  if (senha.length >= 6) pontos += 1;
  if (senha.length >= 10) pontos += 1;
  if (/[A-Z]/.test(senha) && /[a-z]/.test(senha)) pontos += 1;
  if (/\d/.test(senha)) pontos += 1;
  if (/[^A-Za-z0-9]/.test(senha)) pontos += 1;

  if (pontos <= 1) return { nivel: 1, rotulo: 'Fraca' };
  if (pontos <= 3) return { nivel: 2, rotulo: 'Média' };
  return { nivel: 3, rotulo: 'Forte' };
}
