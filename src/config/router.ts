import express from "express";

import {
  getArtistsInfo,
  updateArtistBio,
  addToArtistsCV,
  updateCvItemDetails,
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

router.route("/artists").get(getArtistsInfo);
router.route("/artist/:artistId/about").patch(updateArtistBio);
router.route("/artist/:artistId/:cvSubsection").put(addToArtistsCV);
router
  .route("/artist/:artistId/:cvSubsection/:cvItemId")
  .put(updateCvItemDetails);

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

router
  .route("artworks/:artworkId/images")
  .post(addImgsToArtwork)
  .delete(deleteAllImgs);
router.route("/images/:imgId").delete(deleteAImg);
