import { Router } from 'express';
import {
  setupAdmin,
  createAdmin,
  loginAdmin,
  changePassword,
  getAllAdmins,
  deleteAdmin
} from '../controller/adminController.js';
import { 
  authenticateAdmin, 
  requireSuperAdmin, 
  checkNoAdminExists 
} from '../middleware/adminAuthMiddleware.js';

const adminRouter = Router();

// Public routes
adminRouter.post('/setup', checkNoAdminExists, setupAdmin);
adminRouter.post('/login', loginAdmin);

// Protected routes (require authentication)
adminRouter.use(authenticateAdmin);

adminRouter.post('/change-password', changePassword);

// Super Admin only routes
adminRouter.post('/create', requireSuperAdmin, createAdmin);
adminRouter.get('/all', requireSuperAdmin, getAllAdmins);
adminRouter.delete('/delete/:id', requireSuperAdmin, deleteAdmin);

export default adminRouter;