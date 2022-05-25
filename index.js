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
    const userCollection = client.db("moto_parts").collection("users");
    const myProfileCollection = client.db("moto_parts").collection("myProfile");

    //---------------product parts section  start----------//
    //get read all parts 
    app.get('/parts', async (req, res) => {
      const query = {};
      const cursor = motoPartsCollection.find(query);
      const partsed = await cursor.toArray();
      res.send(partsed.reverse());
    })

    //get on parts details
    app.get('/parts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await motoPartsCollection.findOne(query);
      res.send(result)
    })

    // post parts 
    app.post('/parts', async (req, res) => {
      const addParts = req.body;
      const result = await motoPartsCollection.insertOne(addParts)
      res.send(result);
    })

    // delete parts

    app.delete('/parts/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };

      const result = await motoPartsCollection.deleteOne(filter);

      res.send(result);
    })



    //---------------product parts section  end----------//

    //---------------booking section  start----------//
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

    //---------------booking section  end----------//


    //---------------my profile section  start----------//
    // get my profile details

    app.post('/myProfile', async (req, res) => {
      const profile = req.body;
      const result = await myProfileCollection.insertOne(profile)
      res.send(result);
    })


    app.get('/myProfile', async (req, res) => {
      const query = {};
      const cursor = myProfileCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/myProfile/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await myProfileCollection.findOne(query)
      res.send(result);
    })
    //---------------my profile section  end----------//


    //---------------user & admin section  start----------//

    app.get('/user', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.get('/admin/:email', async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email: email })

      const isAdmin = user.role === 'admin';
      res.send({ admin: isAdmin })
    });


    app.put('/user/admin/:email', async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const updateDoc = {
        $set: { role: 'admin' },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    })



    app.put('/user/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })


    //---------------user & admin section  end----------//






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