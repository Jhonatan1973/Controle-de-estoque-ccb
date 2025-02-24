const db = require("../config/dbconfig");

// Função para adicionar um novo produto
exports.addProduto = (
  numero_nota,
  nome,
  quantidade,
  categoria,
  validade,
  estoque_min
) => {
  return new Promise((resolve, reject) => {
    // Garantir que a data esteja no formato YYYY-MM-DD
    const validadeFormatada = new Date(validade).toISOString().split("T")[0];
    const query =
      "INSERT INTO produtos (numero_nota, nome, quantidade, categoria, validade, estoque_min) VALUES (?, ?, ?, ?, ?, ?)";

    // Converter para inteiros, se necessário
    quantidade = parseInt(quantidade, 10);
    estoque_min = parseInt(estoque_min, 10);

    db.query(
      query,
      [numero_nota, nome, quantidade, categoria, validade, estoque_min],
      (err, results) => {
        if (err) {
          console.error("Erro na inserção:", err);
          reject(err);
        } else {
          console.log("Novo item adicionado:", results);
          resolve(results);
        }
      }
    );
  });
};
