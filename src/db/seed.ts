import mongoose from "mongoose";
import dotenv from "dotenv";

import Artist from "../models/artist";

dotenv.config();

const artistMain = {
  name: "Denise de Cordova",
};

const artistAlias = {
  name: "Amy Bird",
};

const mongoUrl = process.env.MONGO_DB_URL as string;

async function seedDB() {
  await mongoose.connect(mongoUrl);
  console.log("Connected to the DB for DDC");

  await Artist.deleteMany();

  console.log("Removing existing artists from the DB");

  const seedMainArtist = await Artist.create(artistMain);
  console.log("Primary artist added", seedMainArtist);

  const seedSecondaryArtist = await Artist.create(artistAlias);
  console.log("Secondary artist added", seedSecondaryArtist);

  await mongoose.disconnect();
}

seedDB();
