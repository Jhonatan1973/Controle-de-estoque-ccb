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
  module.exports = app;