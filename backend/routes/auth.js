const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../models/user");
const LoginLog = require("../models/LoginLog");

const JWT_SECRET = process.env.JWT_SECRET || "supersegredo_muito_forte";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

// ---------------- REGISTER ----------------
router.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ error: "Dados incompletos" });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ error: "Email já cadastrado" });

    const hash = await bcrypt.hash(senha, 10);
    const user = await User.create({ nome, email, senha: hash });

    res.status(201).json({ msg: "Usuário cadastrado", user: { id: user.id, nome, email } });
  } catch {
    res.status(500).json({ error: "Erro ao cadastrar" });
  }
});

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

    const valid = await bcrypt.compare(senha, user.senha);
    if (!valid) return res.status(401).json({ error: "Credenciais inválidas" });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    await LoginLog.create({ userId: user.id });

    res.json({ token, user: { id: user.id, nome: user.nome, email: user.email }, msg: "Login realizado" });
  } catch {
    res.status(500).json({ error: "Erro no login" });
  }
});

module.exports = router;