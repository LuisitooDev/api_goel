const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors'); // Importa el paquete cors

const app = express();
const PORT = process.env.PORT || 3000;

const mongoURI = 'mongodb+srv://luisitodev:dp8OiCTU9AfSi2bx@cluster0.9jkmrph.mongodb.net/'; // Reemplaza con tus propias credenciales y URL de conexión

app.use(express.json());
app.use(cors()); // Utiliza el middleware de CORS

async function connectToMongoDB() {
    try {
        const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('Conectado a MongoDB');
        return client.db();
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
    }
}

app.get('/', (req, res) => {
    res.send('API funcionando');
});

// Endpoint para insertar datos en MongoDB
app.post('/insert-sensor-data', async (req, res) => {
    const db = await connectToMongoDB();
    const sensorData = req.body;
    const result = await db.collection('sensorData').insertOne(sensorData);
    res.status(201).json({ message: 'Datos del sensor insertados correctamente', insertedId: result.insertedId });
});

// Endpoint para obtener todos los datos del sensor
app.get('/sensor-data', async (req, res) => {
    const db = await connectToMongoDB();
    const sensorData = await db.collection('sensorData').find().toArray();
    res.json(sensorData);
});

app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});