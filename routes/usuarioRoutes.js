const express = require("express");
const router = express.Router();
const {
  registrarUsuario,
  loginUsuario,
  editarUsuario,
  eliminarUsuario
} = require("../controllers/usuarioController");

const auth = require("../middlewares/auth");

router.post("/registro", registrarUsuario);
router.post("/login", loginUsuario);
router.put("/editar", auth, editarUsuario);
router.delete("/eliminar", auth, eliminarUsuario);

module.exports = router;