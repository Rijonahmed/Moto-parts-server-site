const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { send } = require('express/lib/response');
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
    const bookingCollection = client.db("moto_parts").collection("booking");


    //get read all parts
    app.get('/parts', async (req, res) => {
      const query = {};
      const cursor = motoPartsCollection.find(query);
      const partsed = await cursor.toArray();
      res.send(partsed);
    })

    //get on parts details
    app.get('/parts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await motoPartsCollection.findOne(query);
      res.send(result)
    })

    // get booking details

    app.post('/booking', async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    })

    // app.get('/booking', async (req, res) => {
    //   const query = {};
    //   const cursor = bookingCollection.find(query);
    //   const result = await cursor.toArray();
    //   res.send(result);
    // })

    app.get('/booking', async (req, res) => {
      const userEmail = req.query.userEmail;
      const query = { userEmail: userEmail };
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
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