import { Schema, model, Types } from "mongoose";

interface IInstallationMd {
  mediaType: "image" | "video";
  url: string;
  mediaOf: Types.ObjectId;
}

const installationMdSchema: Schema<IInstallationMd> = new Schema({
  mediaType: { type: String, required: true, enum: ["image", "video"] },
  url: { type: String, required: true, unique: true },
  mediaOf: {
    type: Schema.Types.ObjectId,
    ref: "Installation",
    required: true,
  },
});

const InstallationMd = model<IInstallationMd>(
  "InstallationMd",
  installationMdSchema
);

export default InstallationMd;
