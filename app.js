const express = require("express");
require("dotenv").config();
const { Client } = require("pg");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
const port = 3002;

const client = new Client(process.env.DATABASE_URL);

client.connect().catch((err) => console.error("Connection error", err.stack));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/todo", async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM "public"."Todo"');

    res.send(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/todo", async (req, res) => {
  const { description, dueAt } = req.body;

  console.log(description, dueAt);

  try {
    const result = await client.query(
      'INSERT INTO "public"."Todo" ("description", "dueAt") VALUES ($1, $2)',
      [description, dueAt]
    );

    res.send(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/todo/:id", async (req, res) => {
  const { description, dueAt } = req.body;
  const id = req.params.id;

  try {
    const result = await client.query(
      'UPDATE "public"."Todo" SET description = $1, dueAt = $2 WHERE id = $3',
      [description, dueAt, id]
    );

    res.send(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/todo/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await client.query(
      'DELETE FROM "public"."Todo" WHERE id = $1',
      [id]
    );

    res.send(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});
