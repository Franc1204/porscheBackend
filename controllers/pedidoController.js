const Pedido = require("../models/Pedido");
const Modelo = require("../models/Modelo");
const Inventario = require("../models/Inventario");
const asyncHandler = require('express-async-handler');

exports.crearPedido = asyncHandler(async (req, res) => {
  const { modeloId, total } = req.body;
  
  const modelo = await Modelo.findById(modeloId);
  if (!modelo) {
    res.status(404);
    throw new Error("Modelo no encontrado");
  }

  const inventario = await Inventario.findOne({ modelo: modeloId });
  if (!inventario || inventario.cantidad < 1) {
    res.status(400);
    throw new Error("No hay unidades disponibles de este modelo");
  }

  const pedido = new Pedido({
    usuario: req.user.id,
    modelo: modeloId,
    total
  });

  await inventario.historialMovimientos.push({
    tipo: 'salida',
    cantidad: 1,
    referencia: pedido._id.toString(),
    motivo: 'Venta - Nuevo pedido'
  });
  inventario.cantidad -= 1;
  await inventario.save();

  await pedido.save();
  res.status(201).json(pedido);
});

exports.obtenerPedidos = asyncHandler(async (req, res) => {
  const pedidos = await Pedido.find({ usuario: req.user.id })
    .populate('modelo', 'nombre precio tipo')
    .sort({ fecha: -1 });
  res.json(pedidos);
});

exports.obtenerPedidoPorId = asyncHandler(async (req, res) => {
  const pedido = await Pedido.findOne({
    _id: req.params.id,
    usuario: req.user.id
  }).populate('modelo', 'nombre precio tipo');

  if (!pedido) {
    res.status(404);
    throw new Error("Pedido no encontrado");
  }

  res.json(pedido);
});

exports.procesarDevolucion = asyncHandler(async (req, res) => {
  const { motivo } = req.body;
  
  const pedido = await Pedido.findOne({
    _id: req.params.id,
    usuario: req.user.id
  });

  if (!pedido) {
    res.status(404);
    throw new Error("Pedido no encontrado");
  }

  if (pedido.estado === 'devuelto') {
    res.status(400);
    throw new Error("Este pedido ya ha sido devuelto");
  }

  const inventario = await Inventario.findOne({ modelo: pedido.modelo });
  if (!inventario) {
    res.status(404);
    throw new Error("No se encontró el inventario asociado");
  }

  inventario.historialMovimientos.push({
    tipo: 'devolucion',
    cantidad: 1,
    referencia: pedido._id.toString(),
    motivo: `Devolución - ${motivo}`
  });
  inventario.cantidad += 1;
  await inventario.save();

  pedido.estado = 'devuelto';
  pedido.fechaDevolucion = new Date();
  pedido.motivoDevolucion = motivo;
  await pedido.save();

  res.json(pedido);
});

exports.actualizarPedido = asyncHandler(async (req, res) => {
  const { modeloId, total } = req.body;

  if (modeloId) {
    const modelo = await Modelo.findById(modeloId);
    if (!modelo) {
      res.status(404);
      throw new Error("Modelo no encontrado");
    }
  }

  const pedido = await Pedido.findOneAndUpdate(
    { _id: req.params.id, usuario: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!pedido) {
    res.status(404);
    throw new Error("Pedido no encontrado");
  }

  res.json(pedido);
});

exports.eliminarPedido = asyncHandler(async (req, res) => {
  const pedido = await Pedido.findOne({
    _id: req.params.id,
    usuario: req.user.id
  });

  if (!pedido) {
    res.status(404);
    throw new Error("Pedido no encontrado");
  }

  if (pedido.estado !== 'devuelto') {
    res.status(400);
    throw new Error("No se puede eliminar un pedido que no ha sido devuelto");
  }

  await pedido.remove();
  res.json({ mensaje: "Pedido eliminado correctamente" });
});