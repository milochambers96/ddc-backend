import express from "express";

import {
  getArtistsInfo,
  updateArtistBio,
  addToArtistsCV,
  updateCvItemDetails,
  deleteACvItem,
} from "../controllers/artistControllers";

import {
  getAllArtworks,
  addAnArtwork,
  getASpecificArtwork,
  removeAnArtwork,
  updateArtworkDetails,
} from "../controllers/artworkControllers";

import {
  addImgsToArtwork,
  deleteAllImgs,
  deleteAImg,
} from "../controllers/artworkImgControllers";

import { getArtistsIdRef } from "../middleware/getArtistsIdRef";

export const router = express.Router();

// Route to get seeded Artists details for About Page
router.route("/artists").get(getArtistsInfo);

// Routes to  provide administrator capacity to update the seeded artists details.
router.route("/artist/:artistId/about").patch(updateArtistBio);
router.route("/artist/:artistId/:cvSubsection").put(addToArtistsCV);
router
  .route("/artist/:artistId/:cvSubsection/:cvItemId")
  .put(updateCvItemDetails)
  .delete(deleteACvItem);

// Routes to perfrom CRUD operations on artworks
router
  .route("/artworks")
  .get(getAllArtworks)
  .post(getArtistsIdRef, addAnArtwork);
router
  .route("/artworks/:artworkId")
  .get(getASpecificArtwork)
  .delete(removeAnArtwork)
  .put(getArtistsIdRef, updateArtworkDetails);
router.route("/artworks/:artworkType");

// Routes to perform CRUD operations on images of artworks
router
  .route("artworks/:artworkId/images")
  .post(addImgsToArtwork)
  .delete(deleteAllImgs);
router.route("/images/:imgId").delete(deleteAImg);
