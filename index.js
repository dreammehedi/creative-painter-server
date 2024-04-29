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

    // art craft category database
    const databaseCategory = client
      .db("ArtCraftCategoryDB")
      .collection("artCraftCategoryCollection");

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

    // craft data get filter by user email
    app.get("/crafts/users/:user", async (req, res) => {
      const user = req.params.user;
      const query = { user: user };
      const result = await database.find(query).toArray();
      res.send(result);
    });
    // craft insert data
    app.post("/crafts", async (req, res) => {
      const newCraft = req.body;
      const result = await database.insertOne(newCraft);
      res.send(result);
    });

    // craft data update
    app.put("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const updateCraft = req.body;
      const options = { upsert: true };
      const query = { _id: new ObjectId(id) };
      const finallyUpdateCraftData = {
        $set: {
          itemName: updateCraft.itemName,
          itemImage: updateCraft.itemImage,
        },
      };
      const result = await database.updateOne(
        query,
        finallyUpdateCraftData,
        options
      );
      res.send(result);
    });

    // art craft category data get
    app.get("/art-craft-category", async (req, res) => {
      const result = await databaseCategory.find().toArray();
      res.send(result);
    });

    // art craft subcategory data get
    app.get("/art-craft-category/:subcategory", async (req, res) => {
      const subcategory = req.params.subcategory;
      const query = { main_category: subcategory };
      const result = await databaseCategory.find(query).toArray();
      res.send(result);
    });

    // art craft subcategory detailes data get
    app.get("/art-craft-subcategory-detailes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await databaseCategory.findOne(query);
      res.send(result);
    });
    // my art & craft data delete user
    app.delete("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await database.deleteOne(query);
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
