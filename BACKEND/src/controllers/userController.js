import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json("user not found");
    }
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
