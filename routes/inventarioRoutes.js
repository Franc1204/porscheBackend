const express = require('express');
const router = express.Router();
const {
  getInventario,
  getInventarioById,
  createInventario,
  updateInventario,
  registrarMovimiento,
  getHistorialMovimientos
} = require('../controllers/inventarioController');
const auth = require('../middlewares/auth');

router.use(auth);

router.route('/')
  .get(getInventario)
  .post(createInventario);

router.route('/:id')
  .get(getInventarioById)
  .put(updateInventario);

router.route('/:id/movimiento')
  .post(registrarMovimiento);

router.route('/:id/historial')
  .get(getHistorialMovimientos);

module.exports = router; 