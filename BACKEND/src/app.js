import express from 'express';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser'
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import './controllers/googleStrategy.js';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: true}));
router.use(cookieParser());
router.use(morgan('dev'));
router.use(
  cors({
    origin:'http://localhost:5173',
    credentials: true,
  })
);

router.use(passport.initialize());
router.use('/auth', authRoutes);
router.use('/user',userRoutes)
router.use('/job',jobRoutes);
router.use('/application',applicationRoutes)


export default router;
