import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { registerUser, loginUser, updateProfile, logOutUser, updateProfilePic, forgotPassword, resetPassword} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { handleProfilePicUpload } from '../middlewares/uploadFile.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logOutUser',protect,logOutUser)
router.post('/update-Profile',protect,updateProfile)
router.post('/update-Profile-picture', protect,handleProfilePicUpload, updateProfilePic);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }
  )
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`${process.env.FRONTEND_URL}/google-auth-success?token=${token}`);
  }
);

export default router;
