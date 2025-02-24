const db = require("../config/dbconfig");

// Função para listar todos os produtos
exports.getProdutos = (req, res) => {
  db.query("SELECT * FROM produtos", (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar produtos", error: err });
    }
    res.status(200).json(results); // Retorna a lista de produtos
  });
};
const db = require("../config/dbconfig");

exports.addProduto = (
  numero_nota,
  nome,
  quantidade,
  categoria,
  validade,
  estoque_min
) => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO produtos (numero_nota, nome, quantidade, categoria, validade, estoque_min) VALUES (?, ?, ?, ?, ?, ?)";

    console.log("Executando query:", query); // Verifique qual query está sendo gerada

    db.query(
      query,
      [numero_nota, nome, quantidade, categoria, validade, estoque_min],
      (err, results) => {
        if (err) {
          console.error("Erro na query:", err); // Log do erro
          reject(err);
        } else {
          console.log("Item adicionado:", results); // Log de sucesso
          resolve(results);
        }
      }
    );
  });
};

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
