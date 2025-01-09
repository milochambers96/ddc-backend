import mongoose from "mongoose";
import dotenv from "dotenv";

import Administrator from "../models/administrator";
import Artist from "../models/artist";

dotenv.config();

const ddcAdmin = {
  username: process.env.ADMIN_NAME as string,
  email: process.env.ADMIN_EMAIL as string,
  password: process.env.ADMIN_PW as string,
};

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
  await Administrator.deleteMany();

  console.log("Removing existing artists and administrators from the DB");

  const seedPrimaryAdmin = await Administrator.create(ddcAdmin);
  console.log("Primary admin added", seedPrimaryAdmin);

  const seedMainArtist = await Artist.create(artistMain);
  console.log("Primary artist added", seedMainArtist);

  const seedSecondaryArtist = await Artist.create(artistAlias);
  console.log("Secondary artist added", seedSecondaryArtist);

  await mongoose.disconnect();
}

seedDB();
