import mongoose from "mongoose";
import validator from "validator";
import CustomErrorApi from "../error/error.js";
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new CustomErrorApi("Email not valid", 404);
      }
    },
  },
  avatar: { type: String },
  allProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
  password: { required: true, type: String },
  token: { type: String },
});
const userModel = mongoose.model("User", UserSchema);

export default userModel;
