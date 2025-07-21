import express from 'express';
const router = express.Router();
import { protect } from '../middlewares/authMiddleware.js';
import { applyToJob, createJob, deleteJob, editJob, getAllJobs, getAppliedJobs, getSavedJobs, removeSaveJob, saveToJob, uploadResume, userPostedJobs } from '../controllers/jobController.js';
import { handleResumeUpload } from '../middlewares/uploadFile.js';

router.get('/get-jobs', protect, getAllJobs); 
router.post('/create-job',protect,createJob);
router.get('/get-userJob',protect,userPostedJobs)
router.get('/delete-job/:jobId',protect,deleteJob);
router.post('/edit-job',protect,editJob);
router.post('/upload-resume',protect,handleResumeUpload,uploadResume)
router.post('/applyTojob',protect,applyToJob)
router.get('/saveToJob/:jobId',protect,saveToJob)
router.delete('/removeSaveJob/:jobId',protect,removeSaveJob)
router.get('/get-applied-jobs', protect, getAppliedJobs); 
router.get('/get-saved-jobs', protect, getSavedJobs);

export default router;
