import express from "express";

import {
  getAllArtworks,
  addAnArtwork,
} from "../controllers/artworkControllers";

import { getArtistsIdRef } from "../middleware/getArtistsIdRef";

export const router = express.Router();

router
  .route("/artworks")
  .get(getAllArtworks)
  .post(getArtistsIdRef, addAnArtwork);
