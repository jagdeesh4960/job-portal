import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "candidate",
  },
  bio: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: null,
  },
  profileImage: {
    type: Object,
    default: null,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,



});

const userModel = mongoose.model("User", userSchema);
export default userModel;
