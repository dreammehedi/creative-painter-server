const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

// home routes
app.get("/", (req, res) => {
  res.send("My server is running.");
});

// mongodb database string genarate
const uri = `mongodb+srv://${process.env.MD_USER}:${process.env.MD_PASS}@cluster0.sizskqa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// mongodb client configuration
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// mongodb connection function
const run = async () => {
  try {
    await client.connect();
    // create database and collection
    const database = client.db("CraftDB").collection("craftCollection");
    // craft data get
    app.get("/crafts", async (req, res) => {
      const result = await database.find().toArray();
      res.send(result);
    });

    // single craft data get
    app.get("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await database.findOne(query);
      res.send(result);
    });

    // craft insert data
    app.post("/crafts", async (req, res) => {
      const newCraft = req.body;
      const result = await database.insertOne(newCraft);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");
  } finally {
    // await client.close();
  }
};

run().catch(console.dir);
// lister my server
app.listen(port, () => {
  console.log(`my server is listening on ${port}`);
});
