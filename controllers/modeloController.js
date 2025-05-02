// controllers/modeloController.js
const Modelo = require("../models/Modelo");
const { validationResult } = require("express-validator");

exports.crearModelo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const nuevoModelo = new Modelo(req.body);
    await nuevoModelo.save();
    res.status(201).json(nuevoModelo);
  } catch (error) {
    res.status(500).json({ error: "Error al crear modelo" });
  }
};

exports.obtenerModelos = async (req, res) => {
  try {
    const modelos = await Modelo.find()
      .select("nombre precio tipo especificaciones imagenes")
      .sort({ precio: 1 }); 

    res.json(modelos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener modelos" });
  }
};

exports.obtenerModeloPorId = async (req, res) => {
  try {
    const modelo = await Modelo.findById(req.params.id)
      .populate("especificaciones", "-_id -__v"); 

    if (!modelo) {
      return res.status(404).json({ error: "Modelo no encontrado" });
    }
    res.json(modelo);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener modelo" });
  }
};

exports.actualizarModelo = async (req, res) => {
  try {
    const modeloActualizado = await Modelo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } 
    );

    if (!modeloActualizado) {
      return res.status(404).json({ error: "Modelo no encontrado" });
    }
    res.json(modeloActualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar modelo" });
  }
};

exports.eliminarModelo = async (req, res) => {
  try {
    const modeloEliminado = await Modelo.findByIdAndDelete(req.params.id);

    if (!modeloEliminado) {
      return res.status(404).json({ error: "Modelo no encontrado" });
    }
    res.json({ message: "Modelo eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar modelo" });
  }
};