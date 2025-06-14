document.addEventListener("DOMContentLoaded", async () => {
  await atualizarTabela();
  document
    .getElementById("filtroEstoque")
    .addEventListener("change", async (event) => {
      const categoriaSelecionada = event.target.value;
      console.log(categoriaSelecionada);

      showLoader();
      atualizarCabecalhoTabela(categoriaSelecionada);
      if (categoriaSelecionada === "cozinha") {
        await atualizarTabela();
      } else if (categoriaSelecionada === "imobilizados") {
        await atualizarTabelaImobilizados();
      } else if (categoriaSelecionada === "limpeza") {
        await atualizarTabelaLimpeza();
      } else {
        await atualizarTabela();
      }
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
function atualizarCabecalhoTabela(categoria) {
  const cabecalho = document
    .getElementById("tabelaEstoque")
    .getElementsByTagName("thead")[0]
    .getElementsByTagName("tr")[0];
  if (categoria === "cozinha") {
    cabecalho.innerHTML = `
      <th>Nome</th>
      <th>Uni Compra</th>
      <th>Uni Medida</th>
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
  } else if (categoria === "limpeza") {
    cabecalho.innerHTML = `
      <th>Produto</th>
      <th>Uni Compra</th>
      <th>Uni Medida</th>
      <th>Quantidade</th>
      <th>Validade</th>
      <th>Estoque</th>
      <th>Alterar</th>
    `;
  } else {
    cabecalho.innerHTML = `
      <th>Nome</th>
      <th>Uni Compra</th>
      <th>Uni Medida</th>
      <th>Quantidade</th>
      <th>Categoria</th>
      <th>Validade</th>
      <th>Estoque</th>
      <th>Baixa</th>
    `;
  }
}

async function atualizarTabelaLimpeza() {
  const response = await fetch(
    "https://controle-de-estoque-ccb.onrender.com/limpeza"
  );
  const produtosLimpeza = await response.json();
  console.log(produtosLimpeza);

  const tabela = document.getElementById("tabelcompleta");
  tabela.innerHTML = "";

  if (produtosLimpeza.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = "<td colspan='8'>Nenhum produto de limpeza encontrado.</td>";
    tabela.appendChild(tr);
    return;
  }
  // Ordenar em ordem alfabética
  produtosLimpeza.sort((a, b) => a.limp_produto.localeCompare(b.limp_produto));
  produtosLimpeza.forEach((produto) => {
    produto.validade = new Date(produto.validade).toLocaleDateString("pt-BR");

    const tr = document.createElement("tr");
    const estoqueHtml =
      (produto.estoque.max || produto.estoque.med || produto.estoque.min) === 0
        ? ""
        : `<span style="color: green;">Max: ${produto.estoque.max}</span>,
           <span style="color: orange;">Med: ${produto.estoque.med}</span>,
           <span style="color: red;">Min: ${produto.estoque.min}</span>`;

    const { quantidade_limp } = produto;
    let corQuantidade = "black";
    if (!isNaN(quantidade_limp)) {
      if (quantidade_limp <= produto.estoque.min) {
        corQuantidade = "red";
      } else if (quantidade_limp <= produto.estoque.med) {
        corQuantidade = "orange";
      } else {
        corQuantidade = "green";
      }
    }
    tr.innerHTML = `
      <td>${produto.limp_produto}</td>
      <td>${produto.uni_compra}</td>
      <td>${produto.uni_media}</td>
      <td style="color: ${corQuantidade}; font-weight: bold;">${quantidade_limp}</td>
      <td>${produto.validade}</td>
      <td>${estoqueHtml}</td>
      <td>
        <button class="btn-alterar" onclick="abrirModalAlterar(${produto.produto_id_limpeza}, '${produto.limp_produto}')">Alterar</button>
      </td>
    `;

    tabela.appendChild(tr);
  });
}
async function atualizarTabela(filtroCategoria = "TODOS") {
  const response = await fetch(
    "https://controle-de-estoque-ccb.onrender.com/produtos"
  );
  const produtos = await response.json();

  const tabela = document.getElementById("tabelcompleta");
  tabela.innerHTML = "";

  if (produtos.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = "<td colspan='8'>Nenhum produto encontrado.</td>";
    tabela.appendChild(tr);
    return;
  }

  // Aplicar filtro se necessário
  const produtosFiltrados =
    filtroCategoria === "TODOS"
      ? produtos
      : produtos.filter((p) => p.categoria === filtroCategoria);

  // Ordenar
  produtosFiltrados.sort((a, b) => {
    if (a.categoria === b.categoria) {
      return a.nome_produto.localeCompare(b.nome_produto);
    }
    return a.categoria.localeCompare(b.categoria);
  });

  // Preencher tabela
  produtosFiltrados.forEach((produto) => {
    produto.validade = new Date(produto.validade).toLocaleDateString("pt-BR", {
      timeZone: "UTC" || "N/A",
    });

    // lógica da cor da quantidade
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

    const estoqueHtml =
      max === 0 && med === 0 && min === 0
        ? ""
        : `<span style="color: green;">Max: ${max}</span>,
           <span style="color: orange;">Med: ${med}</span>,
           <span style="color: red;">Min: ${min}</span>`;

    const tr = document.createElement("tr");
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

document
  .getElementById("filtroCategoria")
  .addEventListener("change", function () {
    const categoriaSelecionada = this.value;
    atualizarTabela(categoriaSelecionada); // passa a categoria como parâmetro
  });

async function atualizarTabelaImobilizados() {
  console.log("Atualizando tabela de imobilizados...");
  const response = await fetch(
    "https://controle-de-estoque-ccb.onrender.com/imobilizados"
  );
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
    return;
  }

  const response = await fetch(
    `https://controle-de-estoque-ccb.onrender.com/imobilizados/${produtoId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantidade_imobilizados: parseInt(quantidade) }),
    }
  );

  if (response.ok) {
    alert("Quantidade de imobilizado adicionada com sucesso!");
    fecharModal("modal-adicionar");
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
    return;
  }
  showLoader();
  const response = await fetch(
    `https://controle-de-estoque-ccb.onrender.com/imobilizados/${produtoId}/retirar`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantidade_imobilizados: -parseInt(quantidade) }),
    }
  );

  if (response.ok) {
    alert("Quantidade de imobilizado retirada com sucesso!");
    fecharModal("modal-retirar");
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
function fecharModalAdicionar() {
  document.getElementById("modal-alterar").style.display = "none";
}
function abrirModalAdicionar() {
  document.getElementById("modal-alterar").style.display = "none";
  document.getElementById("modal-adicionar").style.display = "block";
  const produtoId = document.getElementById("produtoIdAlterar").value;
  document.getElementById("produtoIdAdicionar").value = produtoId;
}
function fecharModalAdicionarProd() {
  document.getElementById("modal-adicionar").style.display = "none";
}
async function adicionarQuantidade() {
  const produtoId = document.getElementById("produtoIdAdicionar").value;
  const quantidade = document.getElementById("inputquantidade").value;

  if (!produtoId || isNaN(produtoId) || !quantidade || quantidade <= 0) {
    return;
  }
  showLoader();
  const response = await fetch(
    `https://controle-de-estoque-ccb.onrender.com/produtos/${produtoId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantidade: parseInt(quantidade) }),
    }
  );
  if (response.ok) {
    mostrarAnimacaoSucesso();
    fecharModalAdicionar("modal-adicionar");
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
    `https://controle-de-estoque-ccb.onrender.com/produtos/${produtoId}/retirar`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantidade: -parseInt(quantidade) }),
    }
  );
  if (response.ok) {
    alert("Quantidade retirada com sucesso!");
    fecharModalAdicionar("modal-retirar");
    await atualizarTabela();
  } else {
    alert("Erro ao retirar quantidade.");
  }
}
