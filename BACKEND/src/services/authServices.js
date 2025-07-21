import jwt from 'jsonwebtoken';
import crypto from "crypto";

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const generateResetToken = () => {
  const resetToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  return { resetToken, hashedToken };
};
