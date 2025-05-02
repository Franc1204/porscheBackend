// routes/modeloRoutes.js
const express = require("express");
const router = express.Router();
const {
  crearModelo,
  obtenerModelos,
  obtenerModeloPorId,
  actualizarModelo,
  eliminarModelo
} = require("../controllers/modeloController");

router.post("/", crearModelo);          
router.get("/", obtenerModelos);        
router.get("/:id", obtenerModeloPorId); 
router.put("/:id", actualizarModelo);   
router.delete("/:id", eliminarModelo); 

module.exports = router;