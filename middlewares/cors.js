// middlewares/cors.js
const corsOptions = {
    origin: ["http://localhost:80", "http://localhost", "http://127.0.0.1:80", "http://127.0.0.1"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};
  
module.exports = corsOptions;