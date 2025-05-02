const mongoose = require("mongoose");

const compraSchema = new mongoose.Schema({
  usuario: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Usuario", 
    required: true 
  },
  items: [
    {
      modelo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Modelo", 
        required: true 
      },
      nombre: { type: String },
      precio: { type: Number }
    }
  ],
  total: { 
    type: Number, 
    required: true 
  },
  datosPago: {
    tarjetaToken: { type: String }
  },
  fecha: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Compra", compraSchema);