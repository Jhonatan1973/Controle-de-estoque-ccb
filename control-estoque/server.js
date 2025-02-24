const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dbconfig = require("./src/config/dbconfig"); // Importando a configuração do banco de dados
const estoqueRoutes = require("./src/routes/estoqueRoutes"); // Importando as rotas do estoque

// Criação do aplicativo Express
const app = express();

// Middleware para permitir requisições de diferentes origens (CORS)
app.use(cors());

// Middleware para processar JSON no corpo das requisições
app.use(bodyParser.json());

// Rota principal
app.get("/", (req, res) => {
  res.send("API de Controle de Estoque");
});

// Usando as rotas do estoque
app.use("/api/estoque", estoqueRoutes);

// Definindo a porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
app.post("/api/adicionar", express.json(), (req, res) => {
  const novoItem = req.body; // Recebe o item que foi enviado

  // Aqui você pode adicionar o código para salvar o novo item no banco de dados
  console.log("Novo item adicionado:", novoItem);

  // Envia uma resposta de sucesso
  res
    .status(201)
    .json({ message: "Item adicionado com sucesso!", item: novoItem });
});
