const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importamos el paquete cors

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Configuramos CORS para permitir solicitudes desde tu frontend (localhost)
app.use(cors({
    origin: 'http://localhost', // Cambia esto si tu frontend está en otra URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
}));

app.use(bodyParser.json());

// Rutas
app.use('/api', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
