const mongoose = require("mongoose");

const pedidoSchema = new mongoose.Schema({
  usuario: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Usuario", 
    required: true 
  },
  modelo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Modelo", 
    required: true 
  },
  total: { 
    type: Number, 
    required: true 
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmado', 'en_proceso', 'enviado', 'entregado', 'devuelto'],
    default: 'pendiente'
  },
  fecha: { 
    type: Date, 
    default: Date.now 
  },
  fechaDevolucion: {
    type: Date
  },
  motivoDevolucion: {
    type: String
  }
});

module.exports = mongoose.model("Pedido", pedidoSchema);