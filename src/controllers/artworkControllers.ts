import { Request, Response } from "express";

import Artwork from "../models/artwork";

export const getAllArtworks = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const artworks = await Artwork.find().populate("maker", "name");

    if (!artworks || artworks.length === 0) {
      console.log("No artworks found in DB.");
      return res.status(404).json({
        success: false,
        message: "No artworks were found.",
      });
    }

    console.log({
      level: "info",
      message: "Artworks retrieved successfully.",
      count: artworks.length,
      timestamp: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      count: artworks.length,
      data: artworks,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error Occured";

    console.error({
      level: "error",
      message: "Failed to retrieve artworks",
      error: errorMessage,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve artworks. Please try again later.",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

export const getArtworksByType = async (res: Response, req: Request) => {
  const requestedType = req.params.artworkType;
  const artworks = await Artwork.find({ artworkType: requestedType }).populate(
    "maker",
    "name"
  );
  try {
    if (!artworks || artworks.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No ${requestedType} artworks found.`,
      });
    }

    console.log({
      level: "info",
      message: "Artworks retrieved successfully.",
      count: artworks.length,
      timestamp: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      count: artworks.length,
      data: artworks,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error Occured";

    console.error({
      level: "error",
      message: "Failed to retrieve artworks",
      error: errorMessage,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve artworks. Please try again later.",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

export const getASpecificArtwork = async (
  req: Request,
  res: Response
): Promise<any> => {
  const artworkId = req.params.artworkId;
  try {
    const artwork = await Artwork.findById(artworkId).populate("maker", "name");

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: "Unable to locate requested artwork.",
      });
    }

    console.log({
      level: "info",
      message: `${artwork.title} extracted from DB and sent to client.`,
      timestamp: new Date().toISOString(),
    });

    return res.status(200).json({ success: true, data: artwork });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";

    console.error({
      level: "error",
      message: "Failed to retrieve artworks",
      error: errorMessage,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return res.status(500).json({
      success: false,
      message:
        "Unable to locate the artwork. Please review requested artwork and try again.",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

export const addAnArtwork = async (
  req: Request,
  res: Response
): Promise<any> => {
  const newArtworkDetails = req.body;
  try {
    const artworkToCreate = await Artwork.create(newArtworkDetails);

    console.log({
      level: "info",
      message: `${artworkToCreate.title} added to DB.`,
      timestamp: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      message: `${artworkToCreate.title} successfully uploaded.`,
      data: artworkToCreate,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error Occured";

    console.error({
      level: "error",
      message: "Failed to add artwork",
      error: errorMessage,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof Error && error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message:
          "Unable to upload new artwork due to missing information. Please review submitted fields.",
        error:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to add artwork. Please try again later.",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

export const removeAnArtwork = async (
  req: Request,
  res: Response
): Promise<any> => {
  const reqArtworkToRemove = req.params.artworkId;
  try {
    const artworkToRemove = await Artwork.findByIdAndDelete(reqArtworkToRemove);

    if (!artworkToRemove) {
      return res.status(404).json({
        success: false,
        message: "Failed to locate an artwork to remove.",
      });
    }

    console.log({
      level: "info",
      message: `${artworkToRemove.title} removed from db.`,
      timestamp: new Date().toISOString,
    });

    return res.status(200).json({
      success: true,
      message: `${artworkToRemove.title} removed from the site.`,
      data: artworkToRemove,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error Occured.";

    console.error({
      level: "error",
      message: "Unable to remove artwork from DB",
      error: errorMessage,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return res.status(500).json({
      success: "false",
      message: "Unable to remove requested artwork from the site",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

export const updateArtworkDetails = async (
  req: Request,
  res: Response
): Promise<any> => {
  const artworkId = req.params.artworkId;
  const newInfo = req.body;
  try {
    if (!newInfo) {
      return res.status(400).json({
        success: false,
        message: "No information was provided.",
      });
    }

    const artworkToUpdate = await Artwork.findByIdAndUpdate(
      artworkId,
      newInfo,
      {
        new: true,
      }
    );

    if (!artworkToUpdate) {
      return res.status(404).json({
        success: false,
        message: "Unable to locate an artwork to update.",
      });
    }

    console.log({
      level: "info",
      message: `${artworkToUpdate.title} details updated.`,
      timestamp: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: `${artworkToUpdate.title} details updated`,
      data: artworkToUpdate,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error Occured";

    console.error({
      level: "error",
      message: "Failed to update artwork",
      error: errorMessage,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof Error && error.name === "ValidationError") {
      return res.status(404).json({
        success: false,
        message:
          "Unable to update requested artwork due to missing information. Please review submitted fields.",
        error:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update artwork. Please try again later.",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};
