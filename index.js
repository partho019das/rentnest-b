const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;

// Create MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect Database Function
async function connectDB() {
  try {
    // MongoDB Atlas-এর জন্য আলাদা করে client.connect() না ডাকলেও স্বয়ংক্রিয়ভাবে কানেক্ট হয়
    const db = client.db('rentnest');
    return db.collection('property');
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}

// Routes
app.get('/', (req, res) => {
  res.send('RentNest Server is Running!');
});

app.get('/property', async (req, res) => {
  try {
    const collection = await connectDB();
    const cursor = collection.find();
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get('/property/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const collection = await connectDB();
    const query = { _id: new ObjectId(id) };
    const result = await collection.findOne(query);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Only listen when running locally
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// Export for Vercel
module.exports = app;