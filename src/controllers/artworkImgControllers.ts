import { Request, Response } from "express";

import ArtworkImg from "../models/artworkImg";
import Artwork from "../models/artwork";

export const addImageToArtwork = async (
  req: Request,
  res: Response
): Promise<any> => {
  const artworkId = req.params.artworkId;
  const { imageUrls } = req.body;

  try {
    if (imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images were sent to the server to upload.",
      });
    }

    for (let i = 0; i < imageUrls.length; i++) {
      const uploadedImg = await ArtworkImg.create({
        url: imageUrls[i],
        imageOf: artworkId,
      });

      const artwork = await Artwork.findByIdAndUpdate(artworkId, {
        $push: { imgs: uploadedImg._id },
      });

      if (!artwork) {
        return res.status(404).json({
          success: false,
          message: "Artwork not found.",
        });
      }

      console.log({
        level: "info",
        iteration: `The loop has run ${i + 1} out of ${
          imageUrls.length
        } times.`,
        message: `Img with url(${uploadedImg.url}) added to ${artwork?.title}.`,
        timestamp: new Date().toISOString(),
      });
    }

    const artworkWithImgs = await Artwork.findById(artworkId).populate("imgs");

    return res.status(200).json({
      success: true,
      message: `${imageUrls.length} images uploaded to ${artworkWithImgs?.title}`,
      data: artworkWithImgs,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error Occured";

    console.error({
      level: "error",
      message: "Failed to add submitted images to requested artwork",
      error: errorMessage,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to add submitted images to requested artwork",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};
