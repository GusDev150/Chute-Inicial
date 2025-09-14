const { Sequelize } = require("sequelize");
require("dotenv").config();

const DB_NAME = process.env.DB_NAME || "chute_inicial";
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASS || "Marinho150";
const DB_HOST = process.env.DB_HOST || "localhost";

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

sequelize
  .authenticate()
  .then(() => console.log("✅ Conectado ao MySQL"))
  .catch((err) => console.error("❌ Erro ao conectar com MySQL:", err));

module.exports = sequelize;