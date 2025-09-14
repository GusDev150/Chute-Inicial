const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
require("dotenv").config();

// Garante que os models/associações sejam carregados
require("./models/user");
require("./models/Matricula");
require("./models/LoginLog");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);


// Rotas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/matriculas", require("./routes/matricula"));
app.use("/api/admin", require("./routes/admin"));

// Teste API
app.get("/", (req, res) => res.json({ message: "API funcionando!" }));

// Sincroniza banco (sem apagar dados). Use FORCE/ALTER via env se precisar.
const SYNC_FORCE = process.env.SYNC_FORCE === "true";
const SYNC_ALTER = process.env.SYNC_ALTER !== "true"; // default true

sequelize
  .sync({ force: SYNC_FORCE, alter: SYNC_ALTER })
  .then(() => {
    console.log("✅ Banco sincronizado");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => console.error("❌ Erro ao sincronizar banco:", err));