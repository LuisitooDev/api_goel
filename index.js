const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

const mongoURI = 'mongodb+srv://luisitodev:dp8OiCTU9AfSi2bx@cluster0.9jkmrph.mongodb.net/'; // Reemplaza con tus propias credenciales y URL de conexión

app.use(express.json());

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

// Ejemplo de endpoint para insertar datos en MongoDB
app.post('/sensor-data', async (req, res) => {
    const db = await connectToMongoDB();
    const sensorData = req.body; // Suponiendo que el cuerpo de la solicitud contiene datos del sensor en formato JSON
    const result = await db.collection('sensorData').insertOne(sensorData);
    res.status(201).json({ message: 'Datos del sensor insertados correctamente', insertedId: result.insertedId });
});

// Ejemplo de endpoint para obtener todos los datos del sensor
app.get('/sensor-data', async (req, res) => {
    const db = await connectToMongoDB();
    const sensorData = await db.collection('sensorData').find().toArray();
    res.json(sensorData);
});

app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
