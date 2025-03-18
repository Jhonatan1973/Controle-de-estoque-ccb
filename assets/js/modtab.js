document.addEventListener("DOMContentLoaded", async () => { 
  await atualizarTabela();
  document.getElementById("filtroEstoque").addEventListener("change", async (event) => {
    const categoriaSelecionada = event.target.value;
    console.log(categoriaSelecionada);
    showLoader();
    atualizarCabecalhoTabela(categoriaSelecionada);
    setTimeout(async () => {
      if (categoriaSelecionada === "cozinha") {
        await atualizarTabela();
      } else if (categoriaSelecionada === "imobilizados") {
        await atualizarTabelaImobilizados();
      } else {
        await atualizarTabela();
      }
    }, 500); 
  });
  document.addEventListener("atualizarTabelaImobilizados", async () => {
    await atualizarTabelaImobilizados();
  });
});
function showLoader() {
  const tabela = document.getElementById("tabelaEstoque");
  const loader = document.getElementById("loader");
  tabela.style.display = "none";
  loader.style.display = "flex"; 
  setTimeout(() => {
      loader.style.display = "none"; 
      tabela.style.display = "table"; 
  }, 500);
}
setInterval;
function atualizarCabecalhoTabela(categoria) {
  const cabecalho = document
    .getElementById("tabelaEstoque")
    .getElementsByTagName("thead")[0]
    .getElementsByTagName("tr")[0];
  if (categoria === "cozinha") {
    cabecalho.innerHTML = `
      <th>Nome</th>
      <th>Uni Compra</th>
      <th>Uni medida</th>
      <th>Quantidade</th>
      <th>Categoria</th>
      <th>Validade</th>
      <th>Estoque</th>
      <th>Baixa</th>
    `;
  } else if (categoria === "imobilizados") {
    cabecalho.innerHTML = `
      <th>Código</th>
      <th>Nome</th>
      <th>Quantidade</th>
      <th>Fornecedor</th>
      <th>Dependência</th>
      <th>Data de Aquisição</th>
      <th>Status</th>
      <th>Alterar</th>
    `;
  } else {
    cabecalho.innerHTML = `
      <th>Nome</th>
      <th>Uni Compra</th>
      <th>Uni medida</th>
      <th>Quantidade</th>
      <th>Categoria</th>
      <th>Validade</th>
      <th>Estoque</th>
      <th>Baixa</th>
    `;
  }
}
async function atualizarTabela() {
  const response = await fetch("http://localhost:3000/produtos");
  const produtos = await response.json();
  console.log(produtos); 
  const tabela = document.getElementById("tabelcompleta");
  tabela.innerHTML = ""; 
  if (produtos.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = "<td colspan='8'>Nenhum produto encontrado.</td>";
    tabela.appendChild(tr);
    return;
  }
  produtos.forEach((produto) => {
    produto.validade = new Date(produto.validade).toLocaleDateString("pt-BR", {
      timeZone: "UTC" || "N/A",
    });
    const tr = document.createElement("tr");
    const estoqueHtml =
      produto.estoque.max === 0 &&
      produto.estoque.med === 0 &&
      produto.estoque.min === 0
        ? ""
        : `<span style="color: green;">Max: ${produto.estoque.max}</span>,
           <span style="color: orange;">Med: ${produto.estoque.med}</span>,
           <span style="color: red;">Min: ${produto.estoque.min}</span>`;
    const { quantidade } = produto;
    const { max, med, min } = produto.estoque;

    let corQuantidade = "black"; 
    if (!isNaN(quantidade)) {
      const diffMax = Math.abs(quantidade - max);
      const diffMed = Math.abs(quantidade - med);
      const diffMin = Math.abs(quantidade - min);
      if (diffMax <= diffMed && diffMax <= diffMin) {
        corQuantidade = "green";
      } else if (diffMed <= diffMax && diffMed <= diffMin) {
        corQuantidade = "orange";
      } else {
        corQuantidade = "red";
      }
    }
    tr.innerHTML = `
      <td>${produto.nome_produto}</td>
      <td>${produto.uni_compra}</td>
      <td>${produto.uni_media}</td>
      <td style="color: ${corQuantidade}; font-weight: bold;">${quantidade}</td>
      <td>${produto.categoria}</td>
      <td>${produto.validade}</td>
      <td>${estoqueHtml}</td>
      <td>
        <button class="btn-alterar" onclick="abrirModalAlterar(${produto.produto_id}, '${produto.nome_produto}')">Alterar</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}
async function atualizarTabelaImobilizados() {
  console.log("Atualizando tabela de imobilizados...");
  const response = await fetch("http://localhost:3000/imobilizados");
  if (!response.ok) {
    console.error("Erro ao buscar imobilizados:", response.statusText);
    return;
  }
  const imobilizados = await response.json();
  console.log("Imobilizados obtidos:", imobilizados);
  const tabela = document.getElementById("tabelcompleta");
  tabela.innerHTML = "";
  if (imobilizados.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = "<td colspan='8'>Nenhum imobilizado encontrado.</td>";
    tabela.appendChild(tr);
    return;
  }
  imobilizados.forEach((item) => {
    const dataAquisicao = new Date(item.dt_aquisicao);
    const dataFormatada = isNaN(dataAquisicao.getTime())
      ? "Data inválida"
      : dataAquisicao.toLocaleDateString("pt-BR", { timeZone: "UTC" });

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.codigo_imobilizados || "N/A"}</td>
      <td>${item.nome_imobilizados || "N/A"}</td>
      <td>${item.quantidade_imobilizados || 0}</td>
      <td>${item.fornecedor_imobilizados || "N/A"}</td>
      <td>${item.dependencia || "N/A"}</td>
      <td>${dataFormatada}</td>
      <td>${item.status || "N/A"}</td>
      <td>
        <button class="btn-alterar" onclick="abrirModalAlterarImob(${
          item.codigo_imobilizados
        }, '${item.nome_imobilizados}')">Alterar</button>
      </td>
    `;

    tabela.appendChild(tr);
  });
}
async function adicionarQuantidadeImob() {
  const produtoId = document.getElementById("produtoIdAdicionar").value;
  const quantidade = document.getElementById("inputquantidade").value;

  if (!produtoId || isNaN(produtoId) || !quantidade || quantidade <= 0) {
    alert("Erro: Produto inválido ou quantidade incorreta.");
    return;
  }
  
  const response = await fetch(`http://localhost:3000/imobilizados/${produtoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantidade_imobilizados: parseInt(quantidade) }),
  });

  if (response.ok) {
    alert("Quantidade de imobilizado adicionada com sucesso!");
    fecharModal("modal-adicionar");
    // Verifica se o filtro está selecionado para imobilizados e atualiza a tabela
    if (document.getElementById("filtroEstoque").value === "imobilizados") {
      await atualizarTabelaImobilizados();
    }
  } else {
    alert("Erro ao adicionar quantidade.");
  }
}

async function retirarQuantidadeImob() {
  const produtoId = document.getElementById("produtoIdRetirar").value;
  const quantidade = document.getElementById("quantidadeRetirar").value;

  if (!produtoId || isNaN(produtoId) || !quantidade || quantidade <= 0) {
    alert("Erro: Produto inválido ou quantidade incorreta.");
    return;
  }
  showLoader();
  const response = await fetch(`http://localhost:3000/imobilizados/${produtoId}/retirar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantidade_imobilizados: -parseInt(quantidade) }),
  });

  if (response.ok) {
    alert("Quantidade de imobilizado retirada com sucesso!");
    
    fecharModal("modal-retirar");
    // Verifica se o filtro está selecionado para imobilizados e atualiza a tabela
    if (document.getElementById("filtroEstoque").value === "imobilizados") {
      await atualizarTabelaImobilizados();
    }
  } else {
    alert("Erro ao retirar quantidade.");
  }
}

function abrirModalAlterar(produtoId, nomeProduto) {
  document.getElementById("produtoIdAlterar").value = produtoId;
  document.getElementById("modal-adicionar").style.display = "none";
  document.getElementById("modal-retirar").style.display = "none";
  document.getElementById("nomeProdutoAlterar").textContent = nomeProduto;
  document.getElementById("modal-alterar").style.display = "block";
}
function fecharModal(idModal) {
  document.getElementById(idModal).style.display = "none";
}
function abrirModalAlterar(produtoId, nomeProduto) {
  document.getElementById("produtoIdAlterar").value = produtoId;
  document.getElementById("modal-adicionar").style.display = "none";
  document.getElementById("modal-retirar").style.display = "none";
  document.getElementById("nomeProdutoAlterar").textContent = nomeProduto;
  document.getElementById("modal-alterar").style.display = "block";
}
function abrirModalAdicionar() {
  document.getElementById("modal-alterar").style.display = "none";
  document.getElementById("modal-adicionar").style.display = "block";
  const produtoId = document.getElementById("produtoIdAlterar").value;
  document.getElementById("produtoIdAdicionar").value = produtoId;
}
function abrirModalRetirar() {
  document.getElementById("modal-alterar").style.display = "none";
  document.getElementById("modal-retirar").style.display = "block";
  const produtoId = document.getElementById("produtoIdAlterar").value;
  document.getElementById("produtoIdRetirar").value = produtoId;
}
function fecharModal(idModal) {
  document.getElementById(idModal).style.display = "none";
}
async function adicionarQuantidade() {
  const produtoId = document.getElementById("produtoIdAdicionar").value;
  const quantidade = document.getElementById("inputquantidade").value;

  if (!produtoId || isNaN(produtoId) || !quantidade || quantidade <= 0) {
    alert("Erro: Produto inválido ou quantidade incorreta.");
    return;
  }
  showLoader();
  const response = await fetch(`http://localhost:3000/produtos/${produtoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantidade: parseInt(quantidade) }),
  });
  if (response.ok) {
    alert("Quantidade adicionada com sucesso!");
    fecharModal("modal-adicionar");
    await atualizarTabela();
  } else {
    alert("Erro ao adicionar quantidade.");
  }
}
async function retirarQuantidade() {
  const produtoId = document.getElementById("produtoIdRetirar").value;
  const quantidade = document.getElementById("quantidadeRetirar").value;
  if (!produtoId || isNaN(produtoId) || !quantidade || quantidade <= 0) {
    alert("Erro: Produto inválido ou quantidade incorreta.");
    return;
  }
  showLoader();
  const response = await fetch(
    `http://localhost:3000/produtos/${produtoId}/retirar`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantidade: -parseInt(quantidade) }),
    }
  );
  if (response.ok) {
    alert("Quantidade retirada com sucesso!");
    fecharModal("modal-retirar");
    await atualizarTabela();
  } else {
    alert("Erro ao retirar quantidade.");
  }
}