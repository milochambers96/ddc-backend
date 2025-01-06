import express from "express";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import { router } from "./config/router";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(mongoSanitize());
app.use(express.json());
app.use(cors());
app.use("/api", router);

const mongoUrl = process.env.MONGO_DB_URL as string;
const PORT = process.env.PORT;

async function startServer() {
  await mongoose.connect(mongoUrl);
  console.log("👩‍🎨 ", "Connected to Denise de Cordova's database", " 👩‍🎨");
  app.listen(PORT, () => {
    console.log(`Express API running on http://localhost:${PORT}`);
  });
}

startServer();
