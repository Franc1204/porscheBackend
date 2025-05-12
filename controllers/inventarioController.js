const Inventario = require('../models/Inventario');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Modelo = require('../models/Modelo');

const getInventario = asyncHandler(async (req, res) => {
  try {
    const { modelo } = req.query;
    
    let query = {};
    
    if (modelo) {
      if (mongoose.Types.ObjectId.isValid(modelo)) {
        query.modelo = modelo;
      } else {
        console.log('Modelo ID no es un ObjectId válido, buscando por código/nombre:', modelo);
        
        const modeloObj = await Modelo.findOne({ 
          $or: [
            { codigo: modelo },
            { nombre: { $regex: modelo, $options: 'i' } }
          ]
        });
        
        if (modeloObj) {
          console.log('Modelo encontrado:', modeloObj.nombre, modeloObj._id);
          query.modelo = modeloObj._id;
        } else {
          console.log('Modelo no encontrado:', modelo);
          return res.json([]);
        }
      }
    }
    
    const inventario = await Inventario.find(query).populate('modelo');
    res.json(inventario);
  } catch (error) {
    console.error('Error en getInventario:', error);
    res.status(500).json({ error: error.message });
  }
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
  try {
    let { modelo, cantidad, ubicacion, estado } = req.body;
    
    // Validar y encontrar el modelo por ID, código o nombre
    let modeloId = modelo;
    
    if (!mongoose.Types.ObjectId.isValid(modeloId)) {
      console.log('Modelo no es un ObjectId válido en createInventario:', modeloId);
      
      let modeloQuery;
      
      modeloQuery = await Modelo.findOne({ codigo: modeloId });
      
      if (!modeloQuery) {
        const modeloPattern = modeloId.match(/\d+/) 
          ? modeloId.match(/\d+/)[0] 
          : modeloId.replace(/[0-9]/g, '');
          
        console.log('Intentando buscar por patrón de nombre:', modeloPattern);
        
        modeloQuery = await Modelo.findOne({
          nombre: { $regex: modeloPattern, $options: 'i' }
        });
      }
      
      if (!modeloQuery) {
        return res.status(404).json({ 
          error: `Modelo no encontrado con ID/código: ${modeloId}` 
        });
      }
      
      console.log('Modelo encontrado para inventario:', modeloQuery.nombre);
      modeloId = modeloQuery._id;
    }
    
    const inventario = await Inventario.create({
      modelo: modeloId,
      cantidad: cantidad || 2,
      ubicacion: ubicacion || 'showroom',
      estado: estado || 'nuevo',
      historialMovimientos: [{
        tipo: 'entrada',
        cantidad: cantidad || 2,
        referencia: 'INICIAL',
        motivo: 'Registro inicial de inventario'
      }]
    });
    
    res.status(201).json(inventario);
  } catch (error) {
    console.error('Error al crear inventario:', error);
    res.status(500).json({ error: error.message });
  }
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