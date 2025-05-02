const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const { realizarCompra } = require("../controllers/compraController");

router.post("/", verifyToken, realizarCompra);

module.exports = router;