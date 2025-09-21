import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import crypto from "crypto";

import {
  generateResetToken,
  generateToken,
} from "../services/authServices.js";
import userModel from "../models/userModel.js";
import { deleteFile, uploadFile } from "../services/cloudService.js";
import { sendEmail } from "../services/sendEmail.js";

export const registerUser = async (req, res, next) => {
  try {
    let { name, email, password, role, phone } = req.body;

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone
    });

    const token = await generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};


export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json("Invalid email or password");
    }

    const { password: pw, ...userWithoutPassword } = user.toObject();

    const token = await generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json('User not found');

    const { name, bio, phone } = req.body;

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.phone = phone || user.phone;

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const logOutUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized to logout" });
    }

    // Clear the cookie by setting it to null and expiring it
    res.cookie("token", null, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
    });

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    const userId = req.user._id;
    const removeImage = req.body.remove === "true";

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (removeImage) {
      if (user.profileImage && user.profileImage.public_id) {
        await deleteFile(user.profileImage.public_id);
      }

      user.profileImage = { url: null, public_id: null };
      await user.save();

      return res.status(200).json(null);
    }

    const mediaFile = req.file;
    if (!mediaFile) {
      return res.status(400).json({ msg: "Profile picture is required" });
    }

    if (user.profileImage && user.profileImage.public_id) {
      await deleteFile(user.profileImage.public_id);
    }

    const imageBuffer = mediaFile.buffer;
    const profilePic = await uploadFile(imageBuffer);

    user.profileImage = profilePic;
    await user.save();

    return res.status(200).json(user.profileImage.url);
  } catch (err) {
    console.error("Error updating profile picture:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await userModel.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token." });
  }

  // ✅ Manually hash the password before saving
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  // ✅ Clear reset token fields
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save(); // now the password is hashed properly

  res.status(200).json({ message: "Password updated successfully." });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const { resetToken, hashedToken } = generateResetToken();

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendEmail({
    to: email,
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9; text-align: center;">
      <h3 style="color: #333;">Hello, ${user.name}</h3>
      <p style="color: #555; font-size: 16px;">You requested to reset your password.</p>
      <a href="${resetUrl}" target="_blank" style="display: inline-block; margin: 20px 0; padding: 12px 25px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Click here to reset your password</a>
      <p style="color: #888; font-size: 14px;">This link will expire in 15 minutes.</p>
</div>
    `,
  });

  res.status(200).json({ message: "Reset link sent to email." });
};

