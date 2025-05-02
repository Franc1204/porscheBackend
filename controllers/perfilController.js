const Usuario = require("../models/Usuario");

exports.obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.id).select("-password");
    
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const perfilResponse = {
      email: usuario.email,
      nombre: usuario.nombre,
      fechaNacimiento: usuario.fechaNacimiento
    };

    if (usuario.datosTarjeta && usuario.datosTarjeta.numero) {
      perfilResponse.datosTarjeta = {
        numero: "**** **** **** " + usuario.datosTarjeta.numero.slice(-4),
        vencimiento: usuario.datosTarjeta.vencimiento
      };
    }

    res.json(perfilResponse);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: "Error al obtener el perfil" });
  }
};