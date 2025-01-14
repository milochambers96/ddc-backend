import { Schema, model } from "mongoose";

// ? Subdocument Schemas & Interfaces

// Exhhibitions interface and child schema

interface IExhibition {
  title: string;
  year: number;
  location: string;
  soloShow: boolean;
  link?: string;
}

const exhibitionSchema: Schema<IExhibition> = new Schema({
  title: { type: String, required: true, unique: true },
  year: { type: Number, required: true },
  location: { type: String, required: true },
  soloShow: { type: Boolean, required: true },
  link: { type: String },
});

// Residencies interface and child schema

interface IResidency {
  title: string;
  location: string;
  year: number;
  link?: string;
}

const residencySchema: Schema<IResidency> = new Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  year: { type: Number, required: true },
  link: { type: String },
});

// Talks interface and child schema

interface ITalk {
  title: string;
  venue: string;
  year: number;
  with?: string;
  link?: string;
}

const talkSchema: Schema<ITalk> = new Schema({
  title: { type: String, required: true, unique: true },
  year: { type: Number, required: true },
  venue: { type: String, required: true },
  with: { type: String },
  link: { type: String },
});

//  ? Artist interface and parent schema

export interface IArtist {
  name: string;
  dob: number;
  bio: string;
  exhibitions?: IExhibition[];
  residencies?: IResidency[];
  talks?: ITalk[];
}

const artistSchema: Schema<IArtist> = new Schema({
  name: { type: String, required: true, unique: true },
  bio: { type: String, required: true },
  exhibitions: [exhibitionSchema],
  residencies: [residencySchema],
  talks: [talkSchema],
});

const Artist = model<IArtist>("Artist", artistSchema);

export default Artist;
