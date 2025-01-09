import { Request, Response, NextFunction } from "express";

import Artist from "../models/artist";

export const getArtistsIdRef = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const artistName = req.body.maker;
  const artist = await Artist.findOne({ name: artistName });

  if (!artist) {
    return res.status(404).json({
      success: false,
      message: `Unable to upload artwork, as ${artistName} is not an existing creator.`,
    });
  }
  const artistId = artist?._id;
  req.body.maker = artistId;
  next();
};
