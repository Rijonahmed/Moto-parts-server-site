const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const port = process.env.PORT || 5000;



//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xjmxg.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    const motoPartsCollection = client.db("moto_parts").collection("parts");
    app.get('/parts', async (req, res) => {
      const query = {};
      const cursor = motoPartsCollection.find(query);
      const partsed = await cursor.toArray();
      res.send(partsed);
    })

    //get on item details
    app.get('/parts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await motoPartsCollection.findOne(query);
      res.send(result)
    })

  }
  finally {

  }

}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('moto parts server is ready')
})





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})