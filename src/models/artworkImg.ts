import { Schema, model, Types } from "mongoose";

interface IArtworkImg {
  url: string;
  altText: string;
  imageOf: Types.ObjectId;
}

const ArtworkImgSchema: Schema<IArtworkImg> = new Schema({
  url: { type: String, required: true },
  altText: { type: String, required: true },
  imageOf: { type: Schema.Types.ObjectId, ref: "Artwork", required: true },
});

const ArtworkImg = model<IArtworkImg>("ArtworkImg", ArtworkImgSchema);

export default ArtworkImg;
