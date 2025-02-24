const mysql = require("mysql2");
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
module.exports = db;
