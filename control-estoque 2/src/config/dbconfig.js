const express = require("express");
const mysql = require("mysql2");
const app = express();

app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Jhon811@k",
  database: "Controlstoc",
  port: 3300,
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar no banco de dados:", err);
    return;
  }
  console.log("Conexão com o banco de dados MySQL realizada com sucesso!");
});

app.listen(9000, () => {
  console.log("Servidor rodando na porta 3000");
});

module.exports = db;
