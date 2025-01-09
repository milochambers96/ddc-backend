import express from "express";

import {
  getAllArtworks,
  addAnArtwork,
} from "../controllers/artworkControllers";

export const router = express.Router();

router.route("/artworks").get(getAllArtworks).post(addAnArtwork);
