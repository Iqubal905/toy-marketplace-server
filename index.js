const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());








const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.f4mhroj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toyCollection = client.db('toySeller').collection('toys')







    // const indexKeys = { title: 1, category: 1 }; // Replace field1 and field2 with your actual field names
    // const indexOptions = { name: "titleCategory" }; // Replace index_name with the desired index name
    // const result = await toyCollection.createIndex(indexKeys, indexOptions);










    // app.get('/search', (req, res) => {
    //   const name = req.query.name; // assuming the name parameter is passed as a query parameter
    
    //   // Search query using the name parameter
    //   const query = { name: { $regex: name, $options: 'i' } };
    
    //   // Perform the search in your MongoDB collection
    //   // const db = client.db('mydatabase');
    //   // const collection = db.collection('mycollection');
    //   toyCollection.find(query).toArray((err, result) => {
    //     if (err) {
    //       console.error(err);
    //       res.status(500).send('Error searching the database');
    //       return;
    //     }
    
    //     res.send(result); // Return the search results as JSON
    //   });
    // });
    












   app.get('/toys', async (req, res) => {
    const cursor = toyCollection.find().limit(20);
    const result = await cursor.toArray();
    res.send(result);
  })

  
  app.get("/search", async (req, res) =>{
    console.log(req.query.name);
    let query = {}
    if(req.query.name){
      query = {name: req.query.name}
    }
    const result = await toyCollection.find(query).toArray()
    res.send(result)
  })
  
  
  app.get('/category/:text', async (req, res) => {
    console.log(req.params.text);
    if (req.params.text == "sports-car" || req.params.text == "mini-police-car" || req.params.text == "mini-fire-truck"){
     const result = await toyCollection.find({ subCategory: req.params.text }).toArray();
     return res.send(result);
    }
      const result = await toyCollection.find({}).toArray();
         res.send(result);
     })

     app.get('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
    const result = await toyCollection.findOne(query);
          res.send(result);
      })


    
  app.put('/toys/:id', async(req, res) =>{
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const options = { upsert: true };
  const updateToy = req.body;
  const toy = {
    $set:{
      price: updateToy.price,
      availableQuantity: updateToy.availableQuantity,
      detailsDescription: updateToy.detailsDescription
    }
  }
  const result = await toyCollection.updateOne(filter, toy, options);
  res.send(result)
})









app.get('/mycar', async(req, res) =>{
  console.log(req.query.email);
    
  let query = {}

  if (req.query?.email) {
    query = { email: req.query.email }
  }
      
  const result = await toyCollection.find(query).toArray();
  res.send(result)
})



    app.post('/addtoys', async (req, res) =>{
        const toys = req.body
       console.log(toys);
       const result = await toyCollection.insertOne(toys);
       res.send(result)
    })





    app.delete('/toys/:id', async (req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await toyCollection.deleteOne(query)
      res.send(result)
    })


   



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    
  }
}
run().catch(console.dir);














app.get('/',(req, res) => {
    res.send('toy  is running')
})

app.listen(port, () => {
    console.log(`toy server is running on port ${port}`);
})