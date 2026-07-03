import express from 'express';
import {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats
} from '../controller/applicationcontroller';
import { uploadVideo } from '../middleware/upload.js';
import { authenticateAdmin } from '../middleware/adminAuthMiddleware';

const futureRouter = express.Router();

futureRouter.post('/', uploadVideo, submitApplication);

// Admin only routes
futureRouter.use(authenticateAdmin);

futureRouter.get('/getall', getAllApplications);
futureRouter.get('/stats/summary', getApplicationStats);
futureRouter.get('/getone/:id', getApplicationById);
futureRouter.put('/:id/status', updateApplicationStatus);
futureRouter.delete('/delete/:id', deleteApplication);

export default futureRouter;