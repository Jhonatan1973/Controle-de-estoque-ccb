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

              // Se a quantidade for maior que zero (entrada de produto), registra no histórico
              if (quantidade > 0) {
                // Aqui você precisa obter o nome do produto, que pode ser feito de forma simples com outro SELECT
                const nomeProdutoQuery =
                  "SELECT nome FROM produtos WHERE id = ?";
                db.query(nomeProdutoQuery, [id], (err, produtoResult) => {
                  if (err) {
                    reject("Erro ao buscar nome do produto");
                  }
                  const nomeProduto = produtoResult[0]?.nome;

                  // Chama a função para salvar no histórico
                  if (nomeProduto) {
                    const evento = "Entrada"; // Pode ser "Saída" se for retirada
                    // Salvando no histórico
                    salvarHistorico(id, nomeProduto, quantidade, evento)
                      .then(() => resolve())
                      .catch((error) => reject(error));
                  } else {
                    reject("Produto não encontrado no banco");
                  }
                });
              } else {
                resolve(); // Não salva no histórico se a quantidade for zero ou negativa
              }
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
// Função para salvar o histórico de alteração
exports.salvarHistorico = (
  produto_id,
  nome_produto,
  quantidade_alterada,
  evento,
  numero_nota = null,
  valor_nota = null
) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO historico_estoque (produto_id, nome_produto, quantidade_alterada, evento, numero_nota, valor_nota)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
      query,
      [
        produto_id,
        nome_produto,
        quantidade_alterada,
        evento,
        numero_nota,
        valor_nota,
      ],
      (err, results) => {
        if (err) reject(err);
        resolve(results);
      }
    );
  });
};
