const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Jhon811@k",
  database: "controlstoc",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco:", err);
  } else {
    console.log("Conectado ao MySQL");
  }
});
app.use(bodyParser.json());
app.post("/produtos", (req, res) => {
  const produto = req.body;

  if (
    !produto.nome ||
    !produto.uniCompra ||
    !produto.uniMedida ||
    !produto.quantidade ||
    !produto.categoria ||
    !produto.validade ||
    !produto.estoque
  ) {
    return res
      .status(400)
      .json({ error: "Todos os campos devem ser preenchidos!" });
  }
  const sql = `
    INSERT INTO produtos (nome_produto, uni_compra, uni_media, quantidade, categoria, validade, estoque)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    produto.nome,
    produto.uniCompra,
    produto.uniMedida,
    produto.quantidade,
    produto.categoria,
    produto.validade,
    JSON.stringify(produto.estoque),
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Erro ao adicionar produto:", err);
      return res.status(500).json({ error: "Erro ao adicionar produto." });
    }
    res.status(201).json({
      message: "Produto adicionado com sucesso!",
      produtoId: result.insertId,
      ...produto,
    });
  });
});
app.get("/produtos", (req, res) => {
  const sql = `
        SELECT 
            produto_id, 
            nome_produto, 
            uni_compra,
            uni_media,
            quantidade, 
            categoria, 
            validade, 
            estoque 
        FROM produtos;
    `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar os dados:", err);
      res.status(500).json({ error: "Erro ao buscar os dados" });
    } else {
      res.json(results);
    }
  });
});
app.get("/imobilizados", (req, res) => {
  db.query("SELECT * FROM imobilizados", (err, results) => {
    if (err) {
      console.error("Erro na consulta:", err);
      return res.status(500).send("Erro ao buscar imobilizados");
    }
    console.log(results);
    res.json(results);
  });
});
app.put("/imobilizados/:codigo/retirar", (req, res) => {
  const { codigo } = req.params;
  const { quantidade } = req.body;

  if (!codigo || !quantidade || isNaN(quantidade) || quantidade <= 0) {
    return res
      .status(400)
      .json({ error: "Código inválido ou quantidade inválida." });
  }
  const sql = `
    UPDATE imobilizados 
    SET quantidade_imobilizados = quantidade_imobilizados - ? 
    WHERE codigo_imobilizados = ? AND quantidade_imobilizados >= ?`;

  db.query(sql, [quantidade, codigo, quantidade], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar a quantidade:", err);
      return res.status(500).json({ error: "Erro ao retirar quantidade." });
    } else if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ error: "Quantidade insuficiente no estoque." });
    } else {
      res.json({ message: "Quantidade retirada com sucesso!" });
    }
  });
});
app.post("/imobilizados", (req, res) => {
  console.log(req.body);
  const {
    codigo_imobilizados,
    nome_imobilizados,
    quantidade_imobilizados,
    fornecedor_imobilizados,
    dependencia,
    dt_aquisicao,
    status,
  } = req.body;
  const query =
    "INSERT INTO imobilizados (codigo_imobilizados, nome_imobilizados, quantidade_imobilizados, fornecedor_imobilizados, dependencia, dt_aquisicao, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [
    codigo_imobilizados,
    nome_imobilizados,
    quantidade_imobilizados,
    fornecedor_imobilizados,
    dependencia,
    dt_aquisicao,
    status,
  ];
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Erro ao inserir produto imobilizado:", err);
      return res.status(500).send("Erro ao inserir produto imobilizado");
    }
    res
      .status(200)
      .json({ message: "Produto imobilizado adicionado com sucesso!" });
  });
});
app.put("/produtos/:id", (req, res) => {
  const { id } = req.params;
  const { quantidade } = req.body;

  if (!id || isNaN(id) || !quantidade || isNaN(quantidade)) {
    return res.status(400).json({ error: "ID ou quantidade inválidos" });
  }
  const sql =
    "UPDATE produtos SET quantidade = quantidade + ? WHERE produto_id = ?";
  db.query(sql, [quantidade, id], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar a quantidade:", err);
      res.status(500).json({ error: "Erro ao atualizar a quantidade" });
    } else {
      res.json({ message: "Quantidade atualizada com sucesso!" });
    }
  });
});
app.put("/produtos/:id/retirar", (req, res) => {
  const { id } = req.params;
  const { quantidade } = req.body;

  if (!id || isNaN(id) || !quantidade || isNaN(quantidade)) {
    return res.status(400).json({ error: "ID ou quantidade inválidos" });
  }
  const sql =
    "UPDATE produtos SET quantidade = quantidade - ? WHERE produto_id = ? AND quantidade >= ?";

  db.query(sql, [quantidade, id, quantidade], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar a quantidade:", err);
      res.status(500).json({ error: "Erro ao atualizar a quantidade" });
    } else if (result.affectedRows === 0) {
      res.status(400).json({ error: "Quantidade insuficiente no estoque" });
    } else {
      res.json({ message: "Quantidade retirada com sucesso!" });
    }
  });
});
app.post("/historico_entrada", (req, res) => {
  const {
    fornecedor,
    nome_entrada,
    quantidade_entrada,
    numero_nota,
    valor_nota,
    data_entrada,
  } = req.body;
  if (!nome_entrada || !quantidade_entrada || !data_entrada) {
    return res
      .status(400)
      .json({ message: "Preencha todos os campos obrigatórios!" });
  }
  const sql = `INSERT INTO historico_entrada (fornecedor, nome_entrada, quantidade_entrada, numero_nota, valor_nota, data_entrada) 
               VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [
    fornecedor,
    nome_entrada,
    quantidade_entrada,
    numero_nota || null,
    valor_nota || null,
    data_entrada,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Erro ao inserir no banco de dados:", err);
      return res.status(500).json({ message: "Erro ao salvar entrada." });
    }
    res.json({ message: "Entrada salva com sucesso!" });
  });
});
app.post("/historico_saida", (req, res) => {
  const { nome_saida, quantidade_retirada, evento, data_saida, quem_retirou } =
    req.body;
  if (
    !nome_saida ||
    !quantidade_retirada ||
    !evento ||
    !data_saida ||
    !quem_retirou
  ) {
    return res
      .status(400)
      .json({ message: "Preencha todos os campos obrigatórios!" });
  }
  const sql = `INSERT INTO historico_saida (nome_saida, quantidade_retirada, evento, data_saida, quem_retirou) 
               VALUES (?, ?, ?, ?, ?)`;
  const values = [
    nome_saida,
    quantidade_retirada,
    evento,
    data_saida,
    quem_retirou,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Erro ao inserir no banco de dados:", err);
      return res.status(500).json({ message: "Erro ao salvar saída." });
    }
    res.json({ message: "Saída salva com sucesso!" });
  });
});
app.get("/historico_entrada", (req, res) => {
  const query = "SELECT * FROM historico_entrada";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send("Erro ao buscar histórico de entrada");
    } else {
      res.json(results);
    }
  });
});
app.get("/historico_saida", (req, res) => {
  const query = "SELECT * FROM historico_saida";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send("Erro ao buscar histórico de saída");
    } else {
      res.json(results);
    }
  });
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
