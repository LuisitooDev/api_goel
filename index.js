const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const uri = "mongodb+srv://luisitodev:dp8OiCTU9AfSi2bx@cluster0.9jkmrph.mongodb.net";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    console.log("Conectado a MongoDB");

    const db = client.db(); // Obtiene la instancia de la base de datos

    // Configura las rutas de Express después de que el cliente de MongoDB se haya conectado
    app.get("/sensor-data", async (req, res) => {
      try {
        const collection = db.collection("sensorData");
        const results = await collection.find({}).limit(50).toArray();
        res.status(200).send(results);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        res.status(500).send("Error interno del servidor");
      }
    });

    // Add a new document to the collection
    app.post("/insert-sensor-data", async (req, res) => {
        try {
            const collection = db.collection("sensorData");
            const newDocument = req.body;
            newDocument.date = new Date();
            await collection.insertOne(newDocument);
            res.sendStatus(204); // Envía un código de estado 204 (No Content)
        } catch (error) {
            console.error("Error al insertar datos:", error);
            res.status(500).send("Error interno del servidor");
        }
    });

    app.listen(PORT, () => {
      console.log(`Servidor Express escuchando en el puerto ${PORT}`);
    });

  } finally {
    // El bloque finally asegura que el cliente se cierre correctamente
    // incluso si se produce un error al conectarse
    //await client.close();
  }
}

run().catch(console.dir);