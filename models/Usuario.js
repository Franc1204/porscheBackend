const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  perfil: {
    nombre: {
      type: String,
      trim: true
    },
    apellido: {
      type: String,
      trim: true
    },
    tratamiento: {
      type: String,
      trim: true
    },
    telefono: {
      type: String,
      trim: true
    },
    telefonos: [
      {
        numero: { type: String, trim: true },
        preferido: { type: Boolean, default: false }
      }
    ],
    direccion: {
      calle: String,
      ciudad: String,
      estado: String,
      codigoPostal: String,
      pais: String
    },
    direcciones: [
      {
        tipo: { type: String, trim: true, default: 'Particular' },
        calle: String,
        numero: String,
        localidad: String,
        colonia: String,
        ciudad: String,
        estado: String,
        codigoPostal: String,
        pais: String,
        preferida: { type: Boolean, default: false }
      }
    ],
    tarjetas: [
      {
        tipo: { type: String, trim: true }, // VISA, MasterCard, etc.
        ultimos4: { type: String, trim: true }, // Solo últimos 4 dígitos, nunca la tarjeta completa
        titular: { type: String, trim: true },
        expiracion: { type: String, trim: true }, // MM/AA
        preferida: { type: Boolean, default: false }
        // NOTA: Nunca almacenar el CVV/CVC
      }
    ],
    fechaNacimiento: Date,
    fotoPerfil: String
  },
  vehiculos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Modelo'
  }],
  pedidos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pedido'
  }],
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  ultimoAcceso: {
    type: Date,
    default: Date.now
  }
});

// Middleware para encriptar contraseña antes de guardar
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
usuarioSchema.methods.compararPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Usuario", usuarioSchema);