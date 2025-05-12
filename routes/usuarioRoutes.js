const express = require("express");
const router = express.Router();
const {
  registrarUsuario,
  loginUsuario,
  obtenerPerfil,
  editarUsuario,
  eliminarUsuario
} = require("../controllers/usuarioController");

const auth = require("../middlewares/auth");

router.post("/registro", registrarUsuario);
router.post("/login", loginUsuario);
router.get("/perfil", auth, obtenerPerfil);
router.put("/editar", auth, editarUsuario);
router.delete("/eliminar", auth, eliminarUsuario);

module.exports = router;