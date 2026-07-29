const express = require('express');
const dotenv = require('dotenv');
const cors=require('cors');



const app = express();
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

dotenv.config();

const uri = process.env.MONGODB_URI;
const port = process.env.PORT;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    const db=client.db('rentnest')
    const collection=db.collection('property');

    app.get('/property', async (req, res) => {
     const cursor=collection.find();
     const result=await cursor.toArray();
     res.send(result);
});

app.get('/property/:id', async(req,res)=>{

  const id = req.params.id;
  
   const query={
   _id: new ObjectId(id)

   }

   const user=await collection.findOne(query)


    res.send(user);

})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error(error);
  }
}

run();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});