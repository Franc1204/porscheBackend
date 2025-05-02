const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { obtenerPerfil } = require("../controllers/perfilController");

router.get("/", auth, obtenerPerfil);

module.exports = router;