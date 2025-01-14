import { Request, Response } from "express";

import Artist, { IArtist } from "../models/artist";

export const getArtistsInfo = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const artists = await Artist.find();

    if (!artists || artists.length === 0) {
      console.log("No artists found in DB.");
      return res.status(404).json({
        success: false,
        message: "No artists were found. Please review path.",
      });
    }

    console.log({
      level: "info",
      message: "Artists retrueved successfully.",
      count: artists.length,
      timestamp: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      count: artists.length,
      data: artists,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error Occured";

    console.error({
      level: "error",
      message: "Failed to retrieve artists info",
      error: errorMessage,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve info on artists. Please try again later.",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

export const updateArtistBio = async (
  req: Request,
  res: Response
): Promise<any> => {
  const artistId = req.params;
  const newBio = req.body;

  try {
    if (!newBio) {
      return res.status(400).json({
        success: false,
        message: "No new bio was submitted. Please reivew submitted fields.",
      });
    } else if (!artistId) {
      return res.status(400).json({
        success: false,
        message: "Please specify which artist's bio is to be updated.",
      });
    }

    const bioToAdd = await Artist.findByIdAndUpdate(
      artistId,
      { bio: newBio },
      { new: true }
    );

    if (!bioToAdd) {
      return res.status(404).json({
        success: false,
        message:
          "Unable to locate an artist in order to update their bio. Please review submitted information.",
      });
    }

    console.log({
      level: "info",
      message: `${bioToAdd.name}'s bio updated`,
      timestamp: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: `${bioToAdd.name}'s bio updated`,
      data: bioToAdd,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error Occured";

    console.error({
      level: "error",
      message: "Failed to update bio.",
      error: errorMessage,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return res.status(500).json({
      success: false,
      message:
        "Failed to update requested artist's bio. Please try again later.",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

// Utility function to validate if the time it par of the cv subdocuments

const validateCVSubsection = (subsection: string): boolean => {
  const validSubsections = ["exhibitions", "residencies", "talks"];
  return validSubsections.includes(subsection);
};

// ! Controllers for creating, updating and deleting an artists 'CV item'

//  CV items are the following subdocument of an artist:
//      - residencies
//      - talks
//      - exhibitions/shows

// Control to Create a new CV sub doc

export const addToArtistsCV = async (
  req: Request,
  res: Response
): Promise<any> => {
  const artistId = req.params.artistId;
  const cvSubsection = req.params.cvSubsection;
  const cvData = req.body;

  try {
    if (!artistId || !cvSubsection) {
      return res.status(400).json({
        success: false,
        message: "Missing artistId or CV subsection in the request path.",
      });
    }

    if (!validateCVSubsection(cvSubsection)) {
      return res.status(400).json({
        success: false,
        message:
          "Please review submitted information. Only an exhibtion, residency, or talk can be added to an artists CV.",
      });
    }

    const subdocumentKey = `${cvSubsection}`;

    const updatedArtistCV = await Artist.findOneAndUpdate(
      { _id: artistId },
      { $push: { [subdocumentKey]: cvData } },
      { new: true }
    );

    if (!updatedArtistCV) {
      return res.status(404).json({
        success: false,
        message: `Artist not found or ${cvSubsection} not updated.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `${cvSubsection} updated successfully.`,
      data: updatedArtistCV,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error Occured.";

    console.error({
      level: "error",
      message: "Failed to add new CV item.",
      error: errorMessage,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof Error && error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message:
          "Unable to upload new CV item due to missing information. Please review submitted fields.",
        error:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to add CV item. Please try again later.",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

// Control to Update an exisitng CV sub doc

export const updateCvItemDetails = async (
  req: Request,
  res: Response
): Promise<any> => {
  const artistId = req.params.artistId;
  const cvSubsection = req.params.cvSubsection;
  const cvItemId = req.params.cvItemId;
  const newCVData = req.body;

  try {
    if (!artistId || !cvSubsection || !cvItemId || !newCVData) {
      return res.status(400).json({
        success: false,
        message: "Missing required information in the request.",
      });
    }

    if (!validateCVSubsection(cvSubsection)) {
      res.status(400).json({
        success: false,
        message:
          "Please review submitted information. Only the details of an exhibtion, residency, or talk can be updated.",
      });
    }

    const updatePath = `${cvSubsection}._id`;
    const setPath = `${cvSubsection}.$`;

    const artistInfo = await Artist.updateOne(
      { _id: artistId, [updatePath]: cvItemId },
      { $set: { [setPath]: newCVData } },
      { new: true }
    );

    if (artistInfo.modifiedCount > 0) {
      return res.status(200).json({
        success: true,
        message: `${cvSubsection} updated successfully.`,
        data: artistInfo,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `${cvSubsection} not found or no changes made.`,
      });
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error Occured.";

    console.error({
      level: "error",
      message: "Failed to update CV item.",
      error: errorMessage,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof Error && error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message:
          "Unable to update CV item due to missing information. Please review submitted fields.",
        error:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update CV item. Please try again later.",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};
