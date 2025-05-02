const mongoose = require("mongoose");

const movimientoInventarioSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['entrada', 'salida', 'devolucion'],
    required: true
  },
  cantidad: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  referencia: {
    type: String, 
    required: true
  },
  motivo: String
});

const inventarioSchema = new mongoose.Schema({
  modelo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Modelo',
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    default: 0
  },
  ubicacion: {
    type: String,
    enum: ['showroom', 'almacen', 'transito'],
    required: true
  },
  estado: {
    type: String,
    enum: ['nuevo', 'usado', 'en_transito'],
    default: 'nuevo'
  },
  historialMovimientos: [movimientoInventarioSchema],
  ultimaActualizacion: {
    type: Date,
    default: Date.now
  }
});

inventarioSchema.pre('save', function(next) {
  this.ultimaActualizacion = new Date();
  next();
});

module.exports = mongoose.model('Inventario', inventarioSchema); 