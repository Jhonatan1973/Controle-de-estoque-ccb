const tableKey = "estoqueDados"; 


function filtrarTabela() {
    const pesquisa = document.querySelector(".pesquisa").value.toLowerCase();
    const linhas = document.querySelectorAll(".tabela tbody tr"); 

  
    linhas.forEach(linha => {
        const nome = linha.querySelector("td:nth-child(2)").textContent.toLowerCase();
        if (nome.includes(pesquisa)) {
            linha.style.display = ""; 
        } else {
            linha.style.display = "none"; 
        }
    });
}


function editarCelula(event) {
    const td = event.target;  
    const valorAtual = td.textContent; 
    const tipo = td.getAttribute('data-tipo'); 

 
    const input = document.createElement('input');
    input.value = valorAtual;
    input.addEventListener('blur', function() {
     
        td.textContent = input.value;
        salvarDados(); 
    });
    input.addEventListener('keydown', function(e) {
   
        if (e.key === 'Enter') {
            td.textContent = input.value;
            salvarDados(); 
        }
    });

    td.innerHTML = '';  
    td.appendChild(input); 
    input.focus(); 
}


function abrirModal(button) {
    const linha = button.closest('tr'); 
    const quantidadeElement = linha.querySelector('.quantidade');
    const quantidadeAtual = parseInt(quantidadeElement.textContent);

    
    document.getElementById('quantidade').value = 0; 
    document.getElementById('modal').style.display = 'block'; 

   
    window.quantidadeElement = quantidadeElement;
    window.quantidadeAtual = quantidadeAtual;
}


function fecharModal() {
    document.getElementById('modal').style.display = 'none'; 
}


function confirmarAlteracao() {
    const valorAlteracao = parseInt(document.getElementById('quantidade').value); 
    if (!isNaN(valorAlteracao)) {
        const novaQuantidade = window.quantidadeAtual + valorAlteracao; 
        if (novaQuantidade < 0) {
            alert("Não é possível diminuir o estoque para um valor negativo.");
        } else {
            window.quantidadeElement.textContent = novaQuantidade; 
            salvarDados(); 
        }
    } else {
        alert("Por favor, insira um valor válido.");
    }
    fecharModal(); 
}


function salvarDados() {
    const linhas = document.querySelectorAll(".tabela tbody tr");
    const estoque = Array.from(linhas).map(tr => {
        const numeroNota = tr.querySelector("td:nth-child(1)").textContent;
        const nome = tr.querySelector("td:nth-child(2)").textContent;
        const quantidade = parseInt(tr.querySelector(".quantidade").textContent, 10);
        const valor = tr.querySelector("td:nth-child(4)").textContent;
        const validade = tr.querySelector("td:nth-child(5)").textContent;
        const estoqueMinimo = parseInt(tr.querySelector("td:nth-child(6)").textContent, 10);
        return { numeroNota, nome, quantidade, valor, validade, estoqueMinimo };
    });

    localStorage.setItem(tableKey, JSON.stringify(estoque));
}


function carregarDados() {
    const dados = localStorage.getItem(tableKey);
    if (dados) {
        const estoque = JSON.parse(dados);
        const tbody = document.querySelector(".tabela tbody");
        tbody.innerHTML = ""; 

        estoque.forEach(produto => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td class="editavel" data-tipo="numeroNota">${produto.numeroNota}</td>
                <td class="editavel" data-tipo="nome">${produto.nome}</td>
                <td class="quantidade">${produto.quantidade}</td>
                <td class="editavel" data-tipo="valor">${produto.valor}</td>
                <td class="editavel" data-tipo="validade">${produto.validade}</td>
                <td class="editavel" data-tipo="estoqueMinimo">${produto.estoqueMinimo}</td>
                <td><button onclick="abrirModal(this)">Baixa</button></td>
            `;

            
            const editaveis = tr.querySelectorAll('.editavel');
            editaveis.forEach(celula => {
                celula.addEventListener('click', editarCelula);  
            });

            tbody.appendChild(tr);
        });
    }
}


function adicionarLinha() {
    const tbody = document.querySelector(".tabela tbody");
    const tr = document.createElement("tr");

    
    tr.innerHTML = `
        <td class="editavel" data-tipo="numeroNota">Novo</td>
        <td class="editavel" data-tipo="nome">Novo Produto</td>
        <td class="quantidade">0</td>
        <td class="editavel" data-tipo="valor">R$ 0,00</td>
        <td class="editavel" data-tipo="validade">01/2026</td>
        <td class="editavel" data-tipo="estoqueMinimo">0</td>
        <td><button onclick="abrirModal(this)">Baixa</button></td>
    `;

    
    const editaveis = tr.querySelectorAll('.editavel');
    editaveis.forEach(celula => {
        celula.addEventListener('click', editarCelula);  
    });

    tbody.appendChild(tr);

    
    salvarDados();
}


function inicializarDados() {
    const estoqueInicial = [
        { numeroNota: "001", nome: "Açúcar", quantidade: 50, valor: "R$ 4,00", validade: "12/2025", estoqueMinimo: 20 },
        { numeroNota: "002", nome: "Arroz", quantidade: 150, valor: "R$ 5,00", validade: "10/2024", estoqueMinimo: 50 },
        { numeroNota: "003", nome: "Feijão", quantidade: 80, valor: "R$ 6,00", validade: "11/2025", estoqueMinimo: 30 }
    ];

   
    const dadosExistentes = localStorage.getItem(tableKey);
    if (!dadosExistentes) {
        localStorage.setItem(tableKey, JSON.stringify(estoqueInicial));
        carregarDados();
    }
}


window.onload = function () {
    if (!localStorage.getItem(tableKey)) {
        inicializarDados(); 
    } else {
        carregarDados();
    }
};