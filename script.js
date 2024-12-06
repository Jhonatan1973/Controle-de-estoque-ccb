

// Array para armazenar os produtos
let products = [];

// Função para remover um produto
function removeProduct(id) {
    // Filtra os produtos e remove o com o id correspondente
    products = products.filter(product => product.id !== id);

    // Atualizar a lista de produtos
    updateProductList();
}

// Função para obter a URL da imagem com base no nome do produto
function getProductImage(productName) {
    // Realiza uma busca no Google por uma imagem do produto, substituindo espaços por "+", isso pode ser ajustado conforme necessário
    const searchQuery = productName.trim().replace(/\s+/g, "+");
    return `https://www.google.com/search?hl=pt-BR&tbm=isch&q=${searchQuery}`;
}


// Função para verificar o status do estoque
function checkStockStatus(quantity) {
    if (quantity < 50) {
        return "Faltando";
    } else {
        return "Estoque";
    }
}

// Função para atualizar a lista de produtos no HTML
function updateProductList() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ''; // Limpa a lista

    // Adiciona os produtos à lista
    products.forEach(product => {
        const li = document.createElement("li");
        const stockStatus = checkStockStatus(product.quantity);
        li.innerHTML = `
            <img src="https://via.placeholder.com/50" alt="${product.name}" style="width:50px;height:50px;">
            <span>${product.name} - Quantidade: ${product.quantity}</span>
            <button class="status">${stockStatus}</button>
            <button class="remove" onclick="removeProduct(${product.id})">Dar Baixa</button>
            <a href="${product.imageUrl}" target="_blank">Imagem do Produto</a> <!-- Link para a imagem -->
        `;
        productList.appendChild(li);
    });
}
// Função para verificar o status do estoque e definir o status e a cor do botão
function checkStockStatus(quantity) {
    if (quantity < 59) {
        return { status: "Repor", color: "red" }; // Cor vermelha para "Repor"
    } else if (quantity < 100) {
        return { status: "Observar", color: "orange" }; // Cor laranja para "Observar"
    } else {
        return { status: "Estoque", color: "green" }; // Cor verde para "Estoque"
    }
}

// Função para adicionar um novo produto
function addProduct() {
    const productName = document.getElementById("product-name").value;
    const productQuantity = document.getElementById("product-quantity").value;

    if (productName && productQuantity > 0) {
        // Criando o objeto do produto
        const product = {
            name: productName,
            quantity: parseInt(productQuantity),
            id: Date.now(), // Usamos o timestamp como ID único
            imageUrl: getProductImage(productName)  // A URL da imagem será gerada aqui
        };

        // Adicionando o produto ao array
        products.push(product);

        // Limpar os campos
        document.getElementById("product-name").value = '';
        document.getElementById("product-quantity").value = '';

        // Atualizar a lista de produtos
        updateProductList();
    } else {
        alert("Por favor, preencha todos os campos corretamente.");
    }
}

// Função para atualizar a lista de produtos no HTML
function updateProductList() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ''; // Limpa a lista

    // Adiciona os produtos à lista
    products.forEach(product => {
        const li = document.createElement("li");
        const stockStatus = checkStockStatus(product.quantity);
        li.innerHTML = `
            <img src="https://via.placeholder.com/50" alt="${product.name}" style="width:50px;height:50px;">
            <span>${product.name} - Quantidade: ${product.quantity}</span>
            <button class="status" style="background-color: ${stockStatus.color};">${stockStatus.status}</button>
            <button class="remove" onclick="removeProduct(${product.id})" style="background-color: ${stockStatus.color};">Dar Baixa</button>
        `;
        productList.appendChild(li);
    });
}

// Função para remover um produto (opcional)
function removeProduct(id) {
    // Filtra os produtos e remove o com o id correspondente
    products = products.filter(product => product.id !== id);

    // Atualiza a lista de produtos
    updateProductList();
}

// Mapeamento de produtos para URLs de imagens
const productImages = {
    "Arroz": "https://www.davo.com.br/ccstore/v1/images/?source=/file/v7290328888068527/products/7896006711155%20.png&height=940&width=940", // Imagem de arroz
    "Feijão": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhwLSKvZGHG7126NNJazVbI5XLQu6BXu4DDg&s", // Imagem de feijão
    "Café Fort": "https://mercafefaststore.vtexassets.com/unsafe/center/middle/https%3A%2F%2Fadmintresc.vtexassets.com%2Farquivos%2Fids%2F550100%2FCafe_Torrado_e_Moido_FORT_3_Coracoes_Pacote_500g.png%3Fv%3D638168115839070000", // Imagem de macarrão
    "Óleo Vegetal": "https://superprix.vteximg.com.br/arquivos/ids/174667-600-600/Oleo-de-Canola-Liza-900ml.png?v=636217367824830000", // Imagem de óleo
    "Copos plasticos ": "https://cdn.awsli.com.br/600x450/608/608010/produto/29855745/df074aa87d.jpg", // Imagem de óleo
    "Sal sachê (Bom sabor)": "https://images.tcdn.com.br/img/img_prod/602464/sal_bom_sabor_lebre_sache_0_8g_2000un_3219_2_66a35d98d9a6e2e270cbef12a27b5213.jpg", // Imagem de óleo
    "Sal sanchê (União)": "https://images.tcdn.com.br/img/img_prod/602464/acucar_refinado_uniao_premium_sache_5g_caixa_40_unidades_821_2_20201014101912.jpg", // Imagem de óleo
    "Palitos sanchê (Saber)": "https://a-static.mlcdn.com.br/800x560/palito-sache-bom-sabor-c-2-000/embalix/a80304307d4611ec97e74201ac18503a/defa889864d9a378540cc7f61345e907.jpeg", // Imagem de óleo
    "Açúcar": "https://images.tcdn.com.br/img/img_prod/863915/acucar_sache_5g_caixa_com_336_unid_33_2_20201022205617.jpg", // Imagem de óleo
    "Zero cal (adoçante)": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYqxb7UGsdn1QPG3RKEjrHlgphT1zvtSOtCA&s", // Imagem de óleo
    "Sal Ita": "https://salita.com.br/assets/img/Produtos/sachet-ita-white.jpg", // Imagem de óleo
    "Geleias de Frutas": "https://images.tcdn.com.br/img/img_prod/863915/geleia_mix_morango_e_uva_blister_15g_caixa_com_144_unid_95_2_20201023100459.jpg", // Imagem de óleo
    "Banana Canela": "https://m.media-amazon.com/images/I/61MErmxYSeL._AC_UF894,1000_QL80_.jpg", // Imagem de óleo
    "Água SP": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOD1HEw6M-sKaIN9pddYDEWCiP35t1JAvQgw&s", // Imagem de óleo
    "Maria SP": "https://images.tcdn.com.br/img/img_prod/602464/biscoito_maria_sp_sache_10g_c_50_unidades_4463_1_3ab396f4ef3fcc1b70b7b0c62b7b2642.jpg", // Imagem de óleo
    "Cerreal": "https://example.com/oleo.jpg", // Imagem de óleo
    "Bolacha Leite": "https://example.com/oleo.jpg", // Imagem de óleo
    "Toart Bauduco": "https://example.com/oleo.jpg", // Imagem de óleo
    "Torrada": "https://example.com/oleo.jpg", // Imagem de óleo
    "cream": "https://example.com/oleo.jpg", // Imagem de óleo
    "SP Milk": "https://example.com/oleo.jpg", // Imagem de óleo
    // Adicione mais produtos aqui
};

// Função para obter a imagem com base no nome do produto
function getProductImage(productName) {
    // Retorna a imagem do produto ou uma imagem padrão
    return productImages[productName] || "https://via.placeholder.com/150"; // Imagem padrão
}

// Função para atualizar a lista de produtos no HTML
function updateProductList() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ''; // Limpa a lista

    // Adiciona os produtos à lista
    products.forEach(product => {
        const li = document.createElement("li");
        const stockStatus = checkStockStatus(product.quantity);

        // Obtém a URL da imagem com base no nome do produto
        const productImage = getProductImage(product.name);

        li.innerHTML = `
            <img src="${productImage}" alt="${product.name}" style="width:50px;height:50px;">
            <span>${product.name} - Quantidade: ${product.quantity}</span>
            <button class="status" style="background-color: ${stockStatus.color};">${stockStatus.status}</button>
            <button class="remove" onclick="removeProduct(${product.id})" style="background-color: ${stockStatus.color};">Dar Baixa</button>
        `;
        productList.appendChild(li);
    });
}

// Função para adicionar um novo produto
function addProduct() {
    const productName = document.getElementById("product-name").value;
    const productQuantity = document.getElementById("product-quantity").value;

    if (productName && productQuantity > 0) {
        // Criando o objeto do produto
        const product = {
            name: productName,
            quantity: parseInt(productQuantity),
            id: Date.now() // Usamos o timestamp como ID único
        };

        // Adicionando o produto ao array
        products.push(product);

        // Limpar os campos
        document.getElementById("product-name").value = '';
        document.getElementById("product-quantity").value = '';

        // Atualizar a lista de produtos
        updateProductList();

        // Animação no botão de adicionar
        const addButton = document.querySelector('button.add-product'); // Seleciona o botão de adicionar
        addButton.classList.add('adding'); // Adiciona a classe para ativar a animação

        // Remove a classe de animação após 500ms para permitir nova animação
        setTimeout(() => {
            addButton.classList.remove('adding');
        }, 500);
    } else {
        alert("Por favor, preencha todos os campos corretamente.");
    }
}
