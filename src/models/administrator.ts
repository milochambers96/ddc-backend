import { Schema, StringExpression, model } from "mongoose";
import validator from "validator";
import mongooseHidden from "mongoose-hidden";
import bcrypt from "bcrypt";

interface IAdministrator {
  username: string;
  email: string;
  password: string;
}

const administratorSchema: Schema<IAdministrator> = new Schema({
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (email: string) => validator.isEmail(email),
  },
  password: {
    type: String,
    required: true,
    hide: true,
    validate: (password: string) =>
      validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      }),
  },
});

administratorSchema.plugin(
  mongooseHidden({ defaultHidden: { password: true } })
);

administratorSchema.pre("save", function hashPassword(next) {
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
  next();
});

export function validatePassword(
  plainTextPWFromClient: string,
  hashedPasswordFromDB: string
) {
  return bcrypt.compareSync(plainTextPWFromClient, hashedPasswordFromDB);
}

const Administrator = model<IAdministrator>(
  "Administrator",
  administratorSchema
);

export default Administrator;
