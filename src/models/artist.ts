import { Schema, model } from "mongoose";

interface IArtist {
  name: string;
  dob: number;
}

const artistSchema: Schema<IArtist> = new Schema({
  name: { type: String, required: true },
});

const Artist = model<IArtist>("Artist", artistSchema);

export default Artist;
