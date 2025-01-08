import {
  MiscellaneousExpressionOperatorReturningNumber,
  model,
  Schema,
  Types,
} from "mongoose";

interface IArtwork {
  title: string;
  series?: string;
  year: number;
  artworkType: "Sculpture" | "Ceramic" | "Flat Works";
  medium: string;
  width: number;
  height: number;
  depth?: number;
  maker: Types.ObjectId;
}

const ArtworkSchema: Schema<IArtwork> = new Schema({
  title: { type: String, required: true, unique: true },
  series: { type: String },
  year: { type: Number, required: true },
  artworkType: {
    type: String,
    required: true,
    enum: ["Sculpture", "Ceramic", "Flat Works"],
  },
  medium: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  depth: { type: Number },
  maker: { type: Schema.Types.ObjectId, ref: "Artist", required: true },
});

const Artwork = model<IArtwork>("Artwork", ArtworkSchema);

export default Artwork;
