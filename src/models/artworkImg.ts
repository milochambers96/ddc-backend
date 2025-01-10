import { Schema, model, Types } from "mongoose";

interface IArtworkImg {
  url: string;
  altText: string;
  imageOf: Types.ObjectId;
}

const artworkImgSchema: Schema<IArtworkImg> = new Schema({
  url: { type: String, required: true, unique: true },
  imageOf: { type: Schema.Types.ObjectId, ref: "Artwork", required: true },
});

const ArtworkImg = model<IArtworkImg>("ArtworkImg", artworkImgSchema);

export default ArtworkImg;
