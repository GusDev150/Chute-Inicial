const express = require("express");
const router = express.Router();
const Matricula = require("../models/Matricula");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    const { unidade, categoria } = req.body;
    if (!unidade) return res.status(400).json({ error: "Unidade é obrigatória" });

    const matricula = await Matricula.create({
      unidade,
      categoria: categoria || null,
      user_id: req.userId,
    });

    res.json({ msg: "Matrícula realizada com sucesso", matricula });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
