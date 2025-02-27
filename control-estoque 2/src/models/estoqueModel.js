const db = require("../config/dbconfig");

// Função para buscar todos os produtos
exports.getAllProdutos = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM produtos", (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

// Função para adicionar um novo produto
exports.addProduto = (nome, quantidade, preco) => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO produtos (nome, quantidade, preco) VALUES (?, ?, ?)";
    db.query(query, [nome, quantidade, preco], (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.updateQuantidade = (produtos) => {
  return new Promise((resolve, reject) => {
    if (Array.isArray(produtos) && produtos.length > 0) {
      let updatePromises = produtos.map((produto) => {
        const { id, quantidade } = produto;
        return new Promise((resolve, reject) => {
          if (id && quantidade !== undefined) {
            const query = "UPDATE produtos SET quantidade = ? WHERE id = ?";
            db.query(query, [quantidade, id], (error, results) => {
              if (error) {
                reject("Erro ao atualizar quantidade");
              }
              if (results.affectedRows === 0) {
                reject(`Produto com ID ${id} não encontrado.`);
              }
              resolve();
            });
          } else {
            reject("ID ou quantidade não fornecidos.");
          }
        });
      });

      // Aguarda todas as atualizações serem concluídas
      Promise.all(updatePromises)
        .then(() => resolve("Quantidades atualizadas com sucesso!"))
        .catch((err) => reject(err));
    } else {
      reject("Dados inválidos. Envie um array de produtos.");
    }
  });
};
