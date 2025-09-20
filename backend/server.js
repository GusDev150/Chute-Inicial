const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

require("dotenv").config();
require("./models/user");
require("./models/Matricula");
require("./models/LoginLog");

const app = express();

app.use(cors());
app.use(express.json());

const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);
app.use("/api/auth", require("./routes/auth"));
app.use("/api/matriculas", require("./routes/matricula"));
app.use("/api/admin", require("./routes/admin"));

app.get("/", (req, res) => res.json({ message: "API funcionando!" }));

const SYNC_FORCE = process.env.SYNC_FORCE === "true";
const SYNC_ALTER = process.env.SYNC_ALTER !== "true";

sequelize
  .sync({ force: SYNC_FORCE, alter: SYNC_ALTER })
  .then(() => {
    console.log("✅ Banco sincronizado");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => console.error("❌ Erro ao sincronizar banco:", err));