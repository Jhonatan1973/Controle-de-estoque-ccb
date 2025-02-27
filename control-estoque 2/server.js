const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dbconfig = require("./src/config/dbconfig");
const estoqueRoutes = require("./src/routes/estoqueRoutes");
const historicoroutes = require("./src/routes/historicoroutes"); // 🔹 Importe a rota do histórico

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("API de Controle de Estoque");
});

app.use("/api/estoque", estoqueRoutes);
app.use("/api/historico", historicoroutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
