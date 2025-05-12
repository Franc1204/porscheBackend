const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const corsOptions = require("./middlewares/cors");
const path = require("path");

const app = express();

connectDB(); 

// CORS configuration
app.use(cors(corsOptions));

app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

app.use("/api/modelos", require("./routes/modeloRoutes"));
app.use("/api/usuarios", require("./routes/usuarioRoutes"));
app.use("/api/pedidos", require("./routes/pedidoRoutes"));
app.use("/api/inventario", require("./routes/inventarioRoutes"));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});