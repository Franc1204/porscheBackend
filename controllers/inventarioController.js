const Inventario = require('../models/Inventario');
const asyncHandler = require('express-async-handler');

const getInventario = asyncHandler(async (req, res) => {
  const inventario = await Inventario.find().populate('modelo');
  res.json(inventario);
});

const getInventarioById = asyncHandler(async (req, res) => {
  const inventario = await Inventario.findById(req.params.id).populate('modelo');
  if (!inventario) {
    res.status(404);
    throw new Error('Inventario no encontrado');
  }
  res.json(inventario);
});

const createInventario = asyncHandler(async (req, res) => {
  const { modelo, cantidad, ubicacion, estado } = req.body;

  const inventario = await Inventario.create({
    modelo,
    cantidad,
    ubicacion,
    estado,
    historialMovimientos: [{
      tipo: 'entrada',
      cantidad,
      referencia: 'INICIAL',
      motivo: 'Registro inicial de inventario'
    }]
  });

  res.status(201).json(inventario);
});

const updateInventario = asyncHandler(async (req, res) => {
  const { cantidad, ubicacion, estado } = req.body;
  const inventario = await Inventario.findById(req.params.id);

  if (!inventario) {
    res.status(404);
    throw new Error('Inventario no encontrado');
  }

  inventario.cantidad = cantidad || inventario.cantidad;
  inventario.ubicacion = ubicacion || inventario.ubicacion;
  inventario.estado = estado || inventario.estado;

  const updatedInventario = await inventario.save();
  res.json(updatedInventario);
});

const registrarMovimiento = asyncHandler(async (req, res) => {
  const { tipo, cantidad, referencia, motivo } = req.body;
  const inventario = await Inventario.findById(req.params.id);

  if (!inventario) {
    res.status(404);
    throw new Error('Inventario no encontrado');
  }

  let nuevaCantidad = inventario.cantidad;
  if (tipo === 'entrada' || tipo === 'devolucion') {
    nuevaCantidad += cantidad;
  } else if (tipo === 'salida') {
    if (inventario.cantidad < cantidad) {
      res.status(400);
      throw new Error('Stock insuficiente');
    }
    nuevaCantidad -= cantidad;
  }

  inventario.cantidad = nuevaCantidad;
  inventario.historialMovimientos.push({
    tipo,
    cantidad,
    referencia,
    motivo,
    fecha: new Date()
  });

  const updatedInventario = await inventario.save();
  res.json(updatedInventario);
});

// Obtener historial de movimientos
const getHistorialMovimientos = asyncHandler(async (req, res) => {
  const inventario = await Inventario.findById(req.params.id);
  if (!inventario) {
    res.status(404);
    throw new Error('Inventario no encontrado');
  }
  res.json(inventario.historialMovimientos);
});

module.exports = {
  getInventario,
  getInventarioById,
  createInventario,
  updateInventario,
  registrarMovimiento,
  getHistorialMovimientos
}; 