// middlewares/cors.js

const corsOptions = {
  
  origin: ["http://localhost", "http://localhost:80", "http://127.0.0.1", "http://127.0.0.1:80", 'http://localhost:5500'],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true,
  exposedHeaders: ["Content-Length", "X-Requested-With"],
  maxAge: 86400 
};

module.exports = corsOptions;