// models/Modelo.js (versión corregida)
const mongoose = require("mongoose");

const modeloSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  tipo: { type: String, required: true },
  especificaciones: {
    aceleracion: String,
    potencia: String,
    velocidadMax: String, 
    motor: String
  },
  imagenes: [String]
});

module.exports = mongoose.model("Modelo", modeloSchema, "modelos");