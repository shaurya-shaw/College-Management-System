import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import { connectdb } from "./lib/db.js";
import { createAdmin } from "./lib/createAdmin.js";

dotenv.config();

const app = express();

app.use(express.json()); //to parse the req.body which is in json

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await connectdb();
    await createAdmin();

    app.listen(PORT, () => {
      console.log("server is running on port", PORT);
    });
  } catch (error) {
    console.error("startup failed");
    process.exit(1);
  }
};

startServer();
