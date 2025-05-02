const express = require("express");
const router = express.Router();
const {
  crearPedido,
  obtenerPedidos,
  obtenerPedidoPorId,
  actualizarPedido,
  eliminarPedido,
  procesarDevolucion
} = require("../controllers/pedidoController");
const auth = require("../middlewares/auth");

router.use(auth);

router.route("/")
  .get(obtenerPedidos)
  .post(crearPedido);

router.route("/:id")
  .get(obtenerPedidoPorId)
  .put(actualizarPedido)
  .delete(eliminarPedido);

router.post("/:id/devolucion", procesarDevolucion);

module.exports = router;