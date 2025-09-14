const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Matricula = require("../models/Matricula"); // renomeie o arquivo para minúsculo
const LoginLog = require("../models/LoginLog");

// ================= USERS =================

// GET todos usuários
router.get("/users", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// PUT atualizar usuário
router.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    const { nome, email } = req.body;
    await user.update({ nome, email });

    res.json({ message: "Usuário atualizado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
});

// DELETE usuário
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    await user.destroy();
    res.json({ message: "Usuário excluído com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao excluir usuário" });
  }
});

// ================= MATRICULAS =================

// GET todas matrículas
router.get("/matriculas", async (req, res) => {
  const matriculas = await Matricula.findAll({ include: User });
  res.json(matriculas);
});

// PUT atualizar matrícula
router.put("/matriculas/:id", async (req, res) => {
  try {
    const matricula = await Matricula.findByPk(req.params.id);
    if (!matricula) return res.status(404).json({ message: "Matrícula não encontrada" });

    const { unidade, categoria } = req.body;
    await matricula.update({ unidade, categoria });

    res.json({ message: "Matrícula atualizada com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao atualizar matrícula" });
  }
});

// DELETE matrícula
router.delete("/matriculas/:id", async (req, res) => {
  try {
    const matricula = await Matricula.findByPk(req.params.id);
    if (!matricula) return res.status(404).json({ message: "Matrícula não encontrada" });

    await matricula.destroy();
    res.json({ message: "Matrícula excluída com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao excluir matrícula" });
  }
});

// ================= LOGIN LOGS =================

// GET todos logins
router.get("/logins", async (req, res) => {
  const logins = await LoginLog.findAll({ include: User });
  res.json(logins);
});

// DELETE login
router.delete("/logins/:id", async (req, res) => {
  try {
    const log = await LoginLog.findByPk(req.params.id);
    if (!log) return res.status(404).json({ message: "Login não encontrado" });

    await log.destroy();
    res.json({ message: "Login excluído com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao excluir login" });
  }
});

module.exports = router;