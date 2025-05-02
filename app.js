const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const corsOptions = require("./middlewares/cors");
const path = require("path");

const app = express();

connectDB(); 

app.use(cors({
  origin: ['http://localhost:80', 'http://127.0.0.1:80'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

const staticOptions = {
  setHeaders: (res, path) => {
    res.set('Access-Control-Allow-Origin', '*');
  }
};

app.use('/assets', express.static(path.join(__dirname, 'public/assets'), staticOptions));

app.use("/api/modelos", require("./routes/modeloRoutes"));
app.use("/api/usuarios", require("./routes/usuarioRoutes"));
app.use("/api/pedidos", require("./routes/pedidoRoutes"));
app.use("/api/perfil", require("./routes/perfilRoutes"));
app.use("/api/inventario", require("./routes/inventarioRoutes"));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});