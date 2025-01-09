import express from "express";

import {
  getAllArtworks,
  addAnArtwork,
  getASpecificArtwork,
  removeAnArtwork,
  updateArtworkDetails,
} from "../controllers/artworkControllers";

import { getArtistsIdRef } from "../middleware/getArtistsIdRef";

export const router = express.Router();

router
  .route("/artworks")
  .get(getAllArtworks)
  .post(getArtistsIdRef, addAnArtwork);

router
  .route("/artworks/:artworkId")
  .get(getASpecificArtwork)
  .delete(removeAnArtwork)
  .put(updateArtworkDetails);
