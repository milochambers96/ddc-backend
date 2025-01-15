import { Schema, model, Types } from "mongoose";

interface IInstallation {
  installDesc: string;
  year: number;
  location: string;
  //   creators: Types.ObjectId[];
  installMedias: Types.ObjectId[];
}

const installationSchema: Schema<IInstallation> = new Schema({
  installDesc: { type: String, required: true, unique: true },
  year: { type: Number, required: true },
  location: { type: String, required: true },
  installMedias: [{ type: Schema.Types.ObjectId, ref: "InstallationMd" }],
});

const Installation = model<IInstallation>("Installation", installationSchema);

export default Installation;
