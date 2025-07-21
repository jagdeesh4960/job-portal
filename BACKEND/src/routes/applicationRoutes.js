import express from 'express';
const router = express.Router();
import { protect } from '../middlewares/authMiddleware.js';
import { cancelApplication, deleteApplicaton, getApplications, updateStatus } from '../controllers/applicationController.js';


router.get('/get-applications', protect, getApplications)
router.post('/delete-applicaton', protect, deleteApplicaton);
router.post('/update-status', protect, updateStatus)
router.get('/cancel-application/:jobId', protect, cancelApplication)

export default router;
