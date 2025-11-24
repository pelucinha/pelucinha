const WHATSAPP = "5513981101999";

let carrinho = [];
const produtosDiv = document.getElementById("produtos");

async function carregarProdutos() {
  const md = await fetch("products.md").then(r => r.text());
  const linhas = md.split("\n").map(l => l.trim());

  let produtos = [];
  let atual = {};

  linhas.forEach(l => {
    if (l.startsWith("## ")) {
      if (atual.nome) produtos.push(atual);
      atual = { nome: l.replace("## ", "") };
    }
    if (l.startsWith("imagem:")) atual.imagem = l.replace("imagem:", "").trim();
    if (l.startsWith("preco:")) atual.preco = parseFloat(l.replace("preco:", "").trim());
    if (l.startsWith("descricao:")) atual.descricao = l.replace("descricao:", "").trim();
  });

  if (atual.nome) produtos.push(atual);

  renderizarProdutos(produtos);
}

function renderizarProdutos(lista) {
  produtosDiv.innerHTML = "";

  lista.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="./img/${p.imagem}" alt="${p.nome}">
      <div class="info">
        <h3>${p.nome}</h3>
        <p>${p.descricao}</p>
        <p><strong>R$ ${p.preco.toFixed(2)}</strong></p>
      </div>
      <button onclick='adicionarCarrinho(${JSON.stringify(p)})'>
        Adicionar ao carrinho
      </button>
    `;

    produtosDiv.appendChild(card);
  });
}

function adicionarCarrinho(produto) {
  carrinho.push(produto);
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const total = carrinho.reduce((t, p) => t + p.preco, 0);

  document.getElementById("carrinho").innerHTML = `
    <span>${carrinho.length} itens — Total: R$ ${total.toFixed(2)}</span>
    <button onclick="finalizar()">Finalizar pedido</button>
  `;
}

function finalizar() {
  if (carrinho.length === 0) return alert("Seu carrinho está vazio!");

  let mensagem = "Olá, quero fazer um pedido:%0A%0A";

  carrinho.forEach(p => {
    mensagem += `• ${p.nome} — R$ ${p.preco.toFixed(2)}%0A`;
  });

  const total = carrinho.reduce((t, p) => t + p.preco, 0);
  mensagem += `%0ATotal: R$ ${total.toFixed(2)}`;

  const url = `https://wa.me/${WHATSAPP}?text=${mensagem}`;
  window.open(url, "_blank");
}

carregarProdutos();
