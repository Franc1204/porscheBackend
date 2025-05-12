const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.registrarUsuario = async (req, res) => {
  try {
    const { email, password, perfil } = req.body;
    
    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    const usuario = new Usuario({ 
      email, 
      password,
      perfil
    });
    await usuario.save();

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.status(201).json({ 
      token,
      usuario: {
        id: usuario._id,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

exports.loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    const esPasswordValido = await bcrypt.compare(password, usuario.password);
    if (!esPasswordValido) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.json({ 
      token,
      usuario: {
        id: usuario._id,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

exports.obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.id)
      .select('-password')
      .populate('vehiculos')
      .populate('pedidos');
    
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener perfil" });
  }
};

exports.editarUsuario = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      perfil = {},
      password
    } = req.body;

    console.log("Recibida solicitud de actualización de perfil:", { 
      userId, 
      campos: Object.keys(perfil) 
    });
    
    if (perfil.tarjetas) {
      console.log("Datos de tarjetas recibidos:", JSON.stringify(perfil.tarjetas));
    }

    const actualizaciones = {};
    if (perfil) {
      for (const key of Object.keys(perfil)) {
        actualizaciones[`perfil.${key}`] = perfil[key];
      }
    }
    if (password) {
      actualizaciones.password = password;
    }

    if (Object.keys(actualizaciones).length === 0) {
      return res.status(400).json({ error: "No se proporcionaron datos para actualizar" });
    }

    console.log("Actualizando campos:", Object.keys(actualizaciones));

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      userId,
      { $set: actualizaciones },
      { new: true, runValidators: true }
    ).select('-password');

    if (!usuarioActualizado) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    
    // Verificar si las tarjetas se guardaron correctamente
    if (perfil.tarjetas && usuarioActualizado.perfil && usuarioActualizado.perfil.tarjetas) {
      console.log("Tarjetas guardadas exitosamente:", 
        JSON.stringify(usuarioActualizado.perfil.tarjetas)
      );
    }
    
    console.log("Usuario actualizado correctamente");
    res.json(usuarioActualizado);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error al actualizar usuario: " + error.message });
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    const userId = req.user.id;

    const usuarioEliminado = await Usuario.findByIdAndDelete(userId);
    if (!usuarioEliminado) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};
