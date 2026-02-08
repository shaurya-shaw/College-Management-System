import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import { connectdb } from "./lib/db.js";

dotenv.config();

const app = express();

app.use(express.json()); //to parse the req.body which is in json

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("server is running on port", PORT);
  connectdb();
});
