/* ============================================================
   BOLETIM DIGITAL — 8º ANO
   Turma 8A — Chamada 32
   Dados fictícios para estudo.
   ============================================================ */

const CONFIG_ALUNO = {
  turma: "8A",
  numeroChamada: 32,
  apiUrl: "https://boletim-api.profbt.com.br"
};

/* Dados fictícios originais */
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

/* ---------- Funções de normalização e cálculo ---------- */

function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") return null;
  let numero = (typeof valor === "string") ? parseFloat(valor.replace(",", ".")) : Number(valor);
  if (isNaN(numero)) return "invalido";
  if (numero >= 0 && numero <= 10) return numero;
  if (numero > 10 && numero <= 100) return numero / 10;
  return "invalido";
}

function validarNotaEditor(valor) {
  if (valor === null || valor === undefined) return null;
  const texto = String(valor).trim();
  if (texto === "") return null;
  const numero = parseFloat(texto.replace(",", "."));
  if (isNaN(numero)) return "invalido";
  if (numero < 0 || numero > 10) return "invalido";
  return numero;
}

function validarFaltaEditor(valor) {
  const texto = String(valor).trim();
  if (texto === "") return "invalido";
  if (!/^\d+$/.test(texto)) return "invalido";
  const numero = parseInt(texto, 10);
  if (isNaN(numero) || numero < 0) return "invalido";
  return numero;
}

function calcularMedia(notas) {
  const validas = notas.filter(function (n) { return typeof n === "number"; });
  if (validas.length === 0) return null;
  let soma = 0;
  validas.forEach(function (n) { soma += n; });
  return soma / validas.length;
}

function somarFaltas(lista) {
  let total = 0;
  lista.forEach(function (f) { total += f; });
  return total;
}

function definirSituacao(media) {
  if (media === null) return { texto: "Nota ainda não disponível", classe: "situacao-indisponivel" };
  if (media >= 6.0) return { texto: "Bom desempenho", classe: "situacao-bom" };
  return { texto: "Atenção", classe: "situacao-atencao" };
}

function formatarNota(nota) {
  if (nota === null || nota === "invalido") return "—";
  return nota.toFixed(1).replace(".", ",");
}

/* ---------- Estado em memória ---------- */
let dadosAtuais = [];
let pinSessao = null;
let modoEdicao = false;

function processarDisciplinas(lista) {
  return lista.map(function (item) {
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
      situacao: situacao,
      faltasOriginais: item.faltas.slice()
    };
  });
}

/* ---------- DOM ---------- */
const corpoTabela = document.getElementById("corpo-tabela");
const campoPin = document.getElementById("campo-pin");
const botaoEntrar = document.getElementById("botao-entrar");
const mensagemPin = document.getElementById("mensagem-pin");
const telaPin = document.getElementById("tela-pin");
const areaBoletim = document.getElementById("area-boletim");
const botaoAlterar = document.getElementById("botao-alterar");
const botaoSalvar = document.getElementById("botao-salvar");
const mensagemStatus = document.getElementById("mensagem-status");

/* ---------- Renderização ---------- */
function renderizarTabela() {
  corpoTabela.innerHTML = "";
  dadosAtuais.forEach(function (d, indice) {
    const linha = document.createElement("tr");

    const tdDisciplina = document.createElement("td");
    tdDisciplina.textContent = d.disciplina;
    linha.appendChild(tdDisciplina);

    const notas = [d.n1, d.n2, d.n3];
    notas.forEach(function (nota, i) {
      const td = document.createElement("td");
      if (modoEdicao) {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "campo-edicao";
        input.dataset.indice = indice;
        input.dataset.campo = "n" + (i + 1);
        input.value = (nota === null || nota === "invalido") ? "" : nota.toFixed(1).replace(".", ",");
        td.appendChild(input);
      } else {
        td.textContent = formatarNota(nota);
      }
      linha.appendChild(td);
    });

    const tdMedia = document.createElement("td");
    tdMedia.textContent = d.media === null ? "—" : d.media.toFixed(1).replace(".", ",");
    linha.appendChild(tdMedia);

    const tdFaltas = document.createElement("td");
    if (modoEdicao) {
      const inputFalta = document.createElement("input");
      inputFalta.type = "text";
      inputFalta.className = "campo-edicao";
      inputFalta.dataset.indice = indice;
      inputFalta.dataset.campo = "faltas";
      inputFalta.value = d.faltas;
      tdFaltas.appendChild(inputFalta);
    } else {
      tdFaltas.textContent = d.faltas;
    }
    linha.appendChild(tdFaltas);

    const tdSituacao = document.createElement("td");
    tdSituacao.className = d.situacao.classe;
    tdSituacao.textContent = d.situacao.texto;
    linha.appendChild(tdSituacao);

    corpoTabela.appendChild(linha);
  });
}

function renderizarCards() {
  const mediasDisponiveis = dadosAtuais.map(function (d) { return d.media; }).filter(function (m) { return m !== null; });
  let mediaGeral = null;
  if (mediasDisponiveis.length > 0) {
    let soma = 0;
    mediasDisponiveis.forEach(function (m) { soma += m; });
    mediaGeral = soma / mediasDisponiveis.length;
  }
  document.getElementById("card-media-geral").textContent =
    mediaGeral === null ? "—" : mediaGeral.toFixed(1).replace(".", ",");

  let totalFaltas = 0;
  dadosAtuais.forEach(function (d) { totalFaltas += d.faltas; });
  document.getElementById("card-total-faltas").textContent = totalFaltas;

  const bom = dadosAtuais.filter(function (d) { return d.situacao.texto === "Bom desempenho"; }).length;
  document.getElementById("card-bom-desempenho").textContent = bom;

  const atencao = dadosAtuais.filter(function (d) { return d.situacao.texto === "Atenção"; }).length;
  document.getElementById("card-atencao").textContent = atencao;

  const frequenciaDemonstrativa = 92;
  document.getElementById("card-frequencia").textContent = frequenciaDemonstrativa + "%";
}

/* ---------- Gráficos (somente leitura) ---------- */
let graficoMedias = null;
let graficoEvolucao = null;
let graficoFaltas = null;

// Referência interna de risco (NÃO mostrar na tela)
const REFERENCIA_FALTAS = 350;

function atualizarGraficoMedias() {
  const canvas = document.getElementById("graficoMediasDisciplinas");
  if (!canvas) return;

  const disciplinas = dadosAtuais.map(function (d) { return d.disciplina; });
  const medias = dadosAtuais.map(function (d) { return d.media; });

  if (graficoMedias) graficoMedias.destroy();

  graficoMedias = new Chart(canvas, {
    type: "bar",
    data: {
      labels: disciplinas,
      datasets: [{
        label: "Média",
        data: medias,
        backgroundColor: "#2563eb"
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { min: 0, max: 10 }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              if (ctx.raw === null) return "Sem nota";
              return "Média: " + ctx.raw.toFixed(1).replace(".", ",");
            }
          }
        }
      }
    }
  });
}

function atualizarGraficoEvolucao() {
  const canvas = document.getElementById("graficoEvolucaoTrimestres");
  if (!canvas) return;

  const tri1 = [];
  const tri2 = [];
  const tri3 = [];

  dadosAtuais.forEach(function (d) {
    if (typeof d.n1 === "number") tri1.push(d.n1);
    if (typeof d.n2 === "number") tri2.push(d.n2);
    if (typeof d.n3 === "number") tri3.push(d.n3);
  });

  function mediaLista(lista) {
    if (lista.length === 0) return null;
    let soma = 0;
    lista.forEach(function (n) { soma += n; });
    return soma / lista.length;
  }

  const valores = [
    mediaLista(tri1),
    mediaLista(tri2),
    mediaLista(tri3)
  ];

  if (graficoEvolucao) graficoEvolucao.destroy();

  graficoEvolucao = new Chart(canvas, {
    type: "line",
    data: {
      labels: ["1º Tri", "2º Tri", "3º Tri"],
      datasets: [{
        label: "Média geral",
        data: valores,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.15)",
        tension: 0.3,
        spanGaps: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { min: 0, max: 10 }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              if (ctx.raw === null) return "Sem notas";
              return "Média: " + ctx.raw.toFixed(1).replace(".", ",");
            }
          }
        }
      }
    }
  });
}

function atualizarGraficoFaltas() {
  const canvas = document.getElementById("graficoFaltasTrimestres");
  if (!canvas) return;

  let f1 = 0, f2 = 0, f3 = 0;

  dadosAtuais.forEach(function (d) {
    const lista = d.faltasOriginais || [0, 0, 0];
    f1 += lista[0] || 0;
    f2 += lista[1] || 0;
    f3 += lista[2] || 0;
  });

  const total = f1 + f2 + f3;

  // Avaliação interna de risco (não mostrar a referência na tela)
  const estado = document.getElementById("estadoFaltas");
  if (estado) {
    if (total >= REFERENCIA_FALTAS) {
      estado.innerHTML = "<span class='badge-perigo'>Perigo</span>";
    } else {
      estado.innerHTML = "";
    }
  }

  const cardFaltas = canvas.closest(".grafico-card");
  if (cardFaltas) {
    if (total >= REFERENCIA_FALTAS) {
      cardFaltas.classList.add("perigo");
    } else {
      cardFaltas.classList.remove("perigo");
    }
  }

  if (graficoFaltas) graficoFaltas.destroy();

  graficoFaltas = new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["1º Tri", "2º Tri", "3º Tri"],
      datasets: [{
        label: "Faltas",
        data: [f1, f2, f3],
        backgroundColor: "#2563eb"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              return ctx.raw + " faltas";
            }
          }
        }
      }
    }
  });
}

function atualizarGraficos() {
  if (typeof Chart === "undefined") return;
  atualizarGraficoMedias();
  atualizarGraficoEvolucao();
  atualizarGraficoFaltas();
}

function renderizarTudo() {
  renderizarTabela();
  renderizarCards();
  atualizarGraficos();
}

/* ---------- Login ---------- */
botaoEntrar.addEventListener("click", function () {
  const pin = campoPin.value.trim();
  if (pin === "") { mensagemPin.textContent = "Digite o PIN."; return; }

  botaoEntrar.disabled = true;
  mensagemPin.textContent = "Conectando...";

  fetch(CONFIG_ALUNO.apiUrl + "/api/v1/boletins/abrir", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ turma: CONFIG_ALUNO.turma, numero_chamada: CONFIG_ALUNO.numeroChamada, pin: pin })
  })
    .then(function (resposta) {
      if (resposta.status === 401) throw new Error("nao_autorizado");
      if (resposta.status === 429) throw new Error("muitas_tentativas");
      if (!resposta.ok) throw new Error("falha_servidor");
      return resposta.json();
    })
    .then(function (resultado) {
      pinSessao = pin;
      campoPin.value = "";
      mensagemPin.textContent = "";

      const listaBruta = (resultado && resultado.dados && resultado.dados.disciplinas)
        ? resultado.dados.disciplinas
        : dadosBrutos;

      dadosAtuais = processarDisciplinas(listaBruta);
      telaPin.classList.add("escondido");
      areaBoletim.classList.remove("escondido");
      renderizarTudo();
    })
    .catch(function (erro) {
      if (erro.message === "nao_autorizado") mensagemPin.textContent = "Turma, chamada ou PIN inválidos.";
      else if (erro.message === "muitas_tentativas") mensagemPin.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
      else mensagemPin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
    })
    .finally(function () { botaoEntrar.disabled = false; });
});

/* ---------- Edição ---------- */
botaoAlterar.addEventListener("click", function () {
  modoEdicao = true;
  botaoSalvar.classList.remove("escondido");
  botaoAlterar.classList.add("escondido");
  mensagemStatus.textContent = "";
  renderizarTabela();
});

/* ---------- Salvamento ---------- */
botaoSalvar.addEventListener("click", function () {
  const inputs = corpoTabela.querySelectorAll(".campo-edicao");
  let temErro = false;

  const novosDados = dadosAtuais.map(function (d) {
    return {
      disciplina: d.disciplina,
      tri1: d.n1,
      tri2: d.n2,
      tri3: d.n3,
      faltas: d.faltasOriginais.slice()
    };
  });

  inputs.forEach(function (input) {
    input.classList.remove("invalido");
    const indice = parseInt(input.dataset.indice, 10);
    const campo = input.dataset.campo;

    if (campo === "faltas") {
      const valor = validarFaltaEditor(input.value);
      if (valor === "invalido") {
        input.classList.add("invalido");
        temErro = true;
      } else {
        novosDados[indice].faltas = [valor, 0, 0];
      }
    } else {
      const valor = validarNotaEditor(input.value);
      if (valor === "invalido") {
        input.classList.add("invalido");
        temErro = true;
      } else {
        const chave = campo.replace("n", "tri");
        novosDados[indice][chave] = valor;
      }
    }
  });

  if (temErro) {
    mensagemStatus.textContent = "Alguns campos estão inválidos. Corrija antes de salvar.";
    return;
  }

  botaoSalvar.disabled = true;
  mensagemStatus.textContent = "Salvando...";

  fetch(CONFIG_ALUNO.apiUrl + "/api/v1/boletins/salvar", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      turma: CONFIG_ALUNO.turma,
      numero_chamada: CONFIG_ALUNO.numeroChamada,
      pin: pinSessao,
      dados: { disciplinas: novosDados }
    })
  })
    .then(function (resposta) {
      if (!resposta.ok) throw new Error("falha_salvar");
      return resposta.json();
    })
    .then(function () {
      mensagemStatus.textContent = "Dados salvos com sucesso.";
      dadosAtuais = processarDisciplinas(novosDados);
      modoEdicao = false;
      botaoSalvar.classList.add("escondido");
      botaoAlterar.classList.remove("escondido");
      renderizarTudo();
    })
    .catch(function () {
      mensagemStatus.textContent = "Não foi possível salvar. Tente novamente.";
    })
    .finally(function () { botaoSalvar.disabled = false; });
});