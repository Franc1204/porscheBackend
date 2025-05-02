const crypto = require("crypto");
const Compra = require("../models/Compra");
const Modelo = require("../models/Modelo");

exports.realizarCompra = async (req, res) => {
  try {
    const { modeloId, tarjetaNumero, tarjetaVencimiento, tarjetaCVV } = req.body;

    if (!modeloId || !tarjetaNumero || !tarjetaVencimiento || !tarjetaCVV) {
      return res.status(400).json({ error: "Faltan datos de compra" });
    }

    const modelo = await Modelo.findById(modeloId);
    if (!modelo) {
      return res.status(404).json({ error: "Modelo no encontrado" });
    }

    
    const tokenData = `${tarjetaNumero}|${tarjetaVencimiento}|${tarjetaCVV}`;
    const tarjetaToken = crypto.createHash("sha256").update(tokenData).digest("hex");

    const compra = new Compra({
      usuario: req.user.id, 
      items: [
        {
          modelo: modeloId,
          nombre: modelo.nombre,
          precio: modelo.precio
        }
      ],
      total: modelo.precio,
      datosPago: { tarjetaToken }
    });

    await compra.save();

    res.status(201).json({ compra, mensaje: "Gracias por su compra" });
  } catch (error) {
    res.status(500).json({ error: "Error al procesar la compra" });
  }
};