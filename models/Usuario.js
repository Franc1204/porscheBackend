const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usuarioSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6 
  },
  nombre: { type: String },
  fechaNacimiento: { type: Date },
  datosTarjeta: {
    numero: { type: String },
    vencimiento: { type: String },
    cvv: { type: String }
  }
});

usuarioSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("Usuario", usuarioSchema);