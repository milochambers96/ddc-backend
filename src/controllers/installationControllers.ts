import { Request, Response } from "express";

import Installation from "../models/installation";

export const getAllInstalls = async (
  _req: Request,
  res: Response
): Promise<any> => {
  try {
    const installations = await Installation.find().populate(
      "installMedia",
      "mediaType url"
    );

    if (installations.length === 0) {
      console.log("No installations have been found in DB.");
      return res.status(404).json({
        success: false,
        message: "No installations have been added to the website.",
      });
    }

    console.log({
      level: "info",
      message: "Artworks retrieved successfully.",
      count: installations.length,
      timestamp: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      count: installations.length,
      data: installations,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error Occured";

    console.error({
      level: "error",
      message: "Failed to retrieve installations.",
      error: errorMessage,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve installations. Please try again later.",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

export const getSpecificInstall = async (
  req: Request,
  res: Response
): Promise<any> => {
  const installId = req.params.installId;

  try {
    if (!installId) {
      console.log("Installation ID missing from request path.");
      return res.status(400).json({
        success: false,
        message: "No installation specified. Please specify an installation.",
      });
    }

    const installation = await Installation.findById(installId).populate(
      "installMedia",
      "mediaType url"
    );

    if (!installation) {
      console.log("No installation found. Invalid installation id presented.");
      return res.status(404).json({
        success: false,
        message: "Unable to locate requested installation. Please review path.",
      });
    }

    console.log({
      level: "info",
      message: "Installation extracted from DB and sent to client.",
      timestamp: new Date().toISOString(),
      data: installation,
    });

    return res.status(200).json({ success: true, data: installation });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error Occurred";

    console.error({
      level: "error",
      message: "Failed to retrieve installation",
      error: errorMessage,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return res.status(500).json({
      success: false,
      message:
        "Unable to locate the installation. Please review requested artwork and try again.",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

export const addAnInstall = async (
  req: Request,
  res: Response
): Promise<any> => {
  const newInstallDeets = req.body;

  try {
    if (!newInstallDeets) {
      console.log("Empty installation post request recieved.");
      return res.status(400).json({
        success: false,
        message:
          "No installation details provided. Please include installation details.",
      });
    }

    const newInstall = await Installation.create(newInstallDeets);

    console.log({
      level: "info",
      message: `${newInstall.installDesc} @ ${newInstall.location}added to DB.`,
      timestamp: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      message: "New installation successfully uploaded.",
      data: newInstall,
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
          "Unable to upload new installation due to missing information. Please review submitted fields.",
        error:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to add new installation . Please try again later.",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

export const updateAnInstall = async (
  req: Request,
  res: Response
): Promise<any> => {
  const installId = req.params.installId;
  const newDetails = req.body;

  try {
    if (!installId) {
      console.log("Empty installation put request recieved.");
      res.status(400).json({
        success: false,
        message:
          "Unable to remove the information as no installation ID provided.",
      });
    }

    if (!newDetails) {
      console.log("Empty installation put request recieved.");
      return res.status(400).json({
        success: false,
        message:
          "No details were provided to update the installation. Please include installation details.",
      });
    }

    const installToUpdate = await Installation.findByIdAndUpdate(
      installId,
      newDetails,
      { new: true }
    );

    if (!installToUpdate) {
      return res.status(404).json({
        success: false,
        message: "Unable to locate an installation to update.",
      });
    }

    console.log({
      level: "info",
      message: "Installation details updated.",
      modified: Object.keys(newDetails),
      timestamp: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: `Installation details updated successfully`,
      data: installToUpdate,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error Occured";

    console.error({
      level: "error",
      message: "Failed to update installation.",
      error: errorMessage,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof Error && error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message:
          "Unable to update requested installation due to missing information. Please review submitted fields.",
        error:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update installation. Please try again later.",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

export const removeAnInstall = async (
  req: Request,
  res: Response
): Promise<any> => {
  const reqInstallToRemove = req.params.installId;
  try {
    const installToRemove = await Installation.findByIdAndDelete(
      reqInstallToRemove
    );

    if (!installToRemove) {
      return res.status(404).json({
        success: false,
        message: "Failed to locate an installation to remove.",
      });
    }

    console.log({
      level: "info",
      message: `${installToRemove.installDesc} @ ${installToRemove.location} removed from DB.`,
      timestamp: new Date().toISOString,
    });

    return res.status(200).json({
      success: true,
      message: "Requested installation removed from site.",
      data: installToRemove,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error Occured.";

    console.error({
      level: "error",
      message: "Unable to remove installation from DB.",
      error: errorMessage,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return res.status(500).json({
      success: false,
      message: "Unable to remove requested installation from site.",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};
