import express from 'express';
const router = express.Router();

import { protect } from '../middlewares/authMiddleware.js';
import { getProfile } from '../controllers/userController.js';

router.get('/get-profile', protect, getProfile);

export default router;
