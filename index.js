require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_ADMIN}:${process.env.DB_PASS}@cluster0.h1aou.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
  res.send("NSU Hackathon");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    const database = client.db("nsuHackathonDB");
    const users = database.collection("users");
    const reports = database.collection("reports");
    const comments = database.collection("comments");

    app.get("/reports", async (req, res) => {
      const result = await reports.find().toArray();
      res.send(result);
    });

    app.post("/users/:email", async (req, res) => {
      const doc = req.body;
      const result = await users.insertOne(doc);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
