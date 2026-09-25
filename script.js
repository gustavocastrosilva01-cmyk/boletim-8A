/* ============================================================
   BOLETIM DIGITAL — 8º ANO
   Dados fictícios para estudo.
   ============================================================ */

/* ------------------------------------------------------------
   CONCEITO: variável
   É uma "caixa" onde guardamos um valor.
   ------------------------------------------------------------ */

/* ------------------------------------------------------------
   CONCEITO: array
   É uma lista ordenada de valores. Aqui, é a lista das disciplinas.
   ------------------------------------------------------------
   CONCEITO: objeto
   É um conjunto de informações com nomes (chaves) e valores.
   Cada item abaixo é um objeto com os dados de uma disciplina.
   ------------------------------------------------------------ */
const dadosBrutos = [
  { disciplina: "Língua Portuguesa", tri1: 82, tri2: "7,8", tri3: 85, faltas: [2, 1, 1] },
  { disciplina: "Matemática", tri1: 52, tri2: "5,8", tri3: null, faltas: [3, 2, 1] },
  { disciplina: "Ciências", tri1: "8,1", tri2: 76, tri3: 8.0, faltas: [1, 2, 0] },
  { disciplina: "História", tri1: 7.0, tri2: 84, tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Geografia", tri1: 68, tri2: 7.3, tri3: "7,9", faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 86, tri2: "8,1", tri3: 8.7, faltas: [1, 0, 0] },
  { disciplina: "Arte", tri1: 9.0, tri2: 92, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 95, tri2: 9.0, tri3: "9,4", faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 88, tri2: 9.1, tri3: 93, faltas: [1, 0, 1] },
  { disciplina: "Educação Financeira", tri1: 74, tri2: "7,8", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Estudo Orientado", tri1: 8.0, tri2: 83, tri3: "8,5", faltas: [0, 1, 0] },
  { disciplina: "Redação e Leitura", tri1: 62, tri2: "6,8", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 48, tri2: 5.6, tri3: "6,0", faltas: [2, 2, 1] },
  { disciplina: "Literatura Arte e Movimento", tri1: "7,7", tri2: 80, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Práticas Experimentais", tri1: 58, tri2: "6,2", tri3: 6.4, faltas: [1, 1, 1] }
];

/* ------------------------------------------------------------
   FUNÇÃO: normalizarNota(valor)
   Recebe uma nota em qualquer formato e devolve:
   - null  → quando a nota não foi lançada;
   - número entre 0 e 10 → quando a nota é válida;
   - "invalido" → quando o valor não segue nenhuma regra.
   ------------------------------------------------------------ */
function normalizarNota(valor) {
  // Vazio, null ou undefined = nota ainda não lançada
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Se for texto, troca vírgula por ponto
  let numero;
  if (typeof valor === "string") {
    numero = parseFloat(valor.replace(",", "."));
  } else {
    numero = Number(valor);
  }

  // Se não for um número válido, retorna inválido
  if (isNaN(numero)) {
    return "invalido";
  }

  // Entre 0 e 10: permanece igual
  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  // Maior que 10 e menor ou igual a 100: divide por 10
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  // Fora das regras
  return "invalido";
}

/* ------------------------------------------------------------
   FUNÇÃO: calcularMedia(notas)
   Recebe uma lista de notas normalizadas e devolve a média,
   considerando apenas as notas válidas (não nulas).
   ------------------------------------------------------------ */
function calcularMedia(notas) {
  const validas = notas.filter(function (n) {
    return typeof n === "number";
  });

  if (validas.length === 0) {
    return null; // nenhuma nota válida
  }

  let soma = 0;
  validas.forEach(function (n) {
    soma += n;
  });

  return soma / validas.length;
}

/* ------------------------------------------------------------
   FUNÇÃO: somarFaltas(lista)
   Soma os números inteiros de uma lista de faltas.
   ------------------------------------------------------------ */
function somarFaltas(lista) {
  let total = 0;
  lista.forEach(function (f) {
    total += f;
  });
  return total;
}

/* ------------------------------------------------------------
   FUNÇÃO: definirSituacao(media)
   Usa if para decidir a situação da disciplina.
   ------------------------------------------------------------ */
function definirSituacao(media) {
  if (media === null) {
    return { texto: "Nota ainda não disponível", classe: "situacao-indisponivel" };
  }
  if (media >= 6.0) {
    return { texto: "Bom desempenho", classe: "situacao-bom" };
  }
  return { texto: "Atenção", classe: "situacao-atencao" };
}

/* ------------------------------------------------------------
   FUNÇÃO: formatarNota(nota)
   Devolve o texto que vai aparecer na tabela.
   ------------------------------------------------------------ */
function formatarNota(nota) {
  if (nota === null || nota === "invalido") {
    return "—";
  }
  return nota.toFixed(1).replace(".", ",");
}

/* ------------------------------------------------------------
   Aqui processamos cada disciplina e montamos uma lista pronta.
   ------------------------------------------------------------ */
const disciplinasProcessadas = dadosBrutos.map(function (item) {
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);

  const media = calcularMedia([n1, n2, n3]);
  const faltas = somarFaltas(item.faltas);
  const situacao = definirSituacao(media);

  return {
    disciplina: item.disciplina,
    n1: n1,
    n2: n2,
    n3: n3,
    media: media,
    faltas: faltas,
    situacao: situacao
  };
});

/* ------------------------------------------------------------
   CONCEITO: DOM
   É a representação da página HTML que o JavaScript pode acessar
   e modificar. Usamos document.getElementById para pegar elementos.
   ------------------------------------------------------------ */

/* ===== PREENCHER A TABELA ===== */
const corpoTabela = document.getElementById("corpo-tabela");

/* CONCEITO: forEach
   Percorre cada item de um array e executa uma ação. */
disciplinasProcessadas.forEach(function (d) {
  const linha = document.createElement("tr");

  linha.innerHTML =
    "<td>" + d.disciplina + "</td>" +
    "<td>" + formatarNota(d.n1) + "</td>" +
    "<td>" + formatarNota(d.n2) + "</td>" +
    "<td>" + formatarNota(d.n3) + "</td>" +
    "<td>" + (d.media === null ? "—" : d.media.toFixed(1).replace(".", ",")) + "</td>" +
    "<td>" + d.faltas + "</td>" +
    "<td class='" + d.situacao.classe + "'>" + d.situacao.texto + "</td>";

  corpoTabela.appendChild(linha);
});

/* ===== PREENCHER OS CARDS DE RESUMO ===== */

// Média geral: média das médias disponíveis
const mediasDisponiveis = disciplinasProcessadas
  .map(function (d) { return d.media; })
  .filter(function (m) { return m !== null; });

let mediaGeral = null;
if (mediasDisponiveis.length > 0) {
  let soma = 0;
  mediasDisponiveis.forEach(function (m) { soma += m; });
  mediaGeral = soma / mediasDisponiveis.length;
}

document.getElementById("card-media-geral").textContent =
  mediaGeral === null ? "—" : mediaGeral.toFixed(1).replace(".", ",");

// Total de faltas (soma de todas as disciplinas)
let totalFaltas = 0;
disciplinasProcessadas.forEach(function (d) { totalFaltas += d.faltas; });
document.getElementById("card-total-faltas").textContent = totalFaltas;

// Disciplinas com bom desempenho
const bomDesempenho = disciplinasProcessadas.filter(function (d) {
  return d.situacao.texto === "Bom desempenho";
}).length;
document.getElementById("card-bom-desempenho").textContent = bomDesempenho;

// Disciplinas que precisam de atenção
const atencao = disciplinasProcessadas.filter(function (d) {
  return d.situacao.texto === "Atenção";
}).length;
document.getElementById("card-atencao").textContent = atencao;

// Frequência: APENAS DEMONSTRATIVA nesta primeira versão.
// No futuro, esse valor será calculado de outra forma.
const frequenciaDemonstrativa = 92;
document.getElementById("card-frequencia").textContent = frequenciaDemonstrativa + "%";