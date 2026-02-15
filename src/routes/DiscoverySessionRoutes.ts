import express from 'express';
import {
  createDiscoverySession,
  getAllDiscoverySessions,
  checkAvailability,
  getAvailableSlots
} from '../controller/DiscoverySessionController';
// import { protect, admin } from '../middleware/authMiddleware';
import { rateLimit } from 'express-rate-limit';

const discoveryRouter = express.Router();

// Rate limiting for public routes
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 booking requests per 15 minutes
  message: 'Too many booking attempts, please try again after 15 minutes'
});

const availabilityLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 availability checks per minute
  message: 'Too many requests, please slow down'
});

// Public routes
discoveryRouter.post('/', bookingLimiter, createDiscoverySession);
discoveryRouter.post('/check-availability', availabilityLimiter, checkAvailability);
discoveryRouter.get('/available-slots', availabilityLimiter, getAvailableSlots);

// Protected routes (Admin only)
// discoveryRouter.get('/', protect, admin, getAllDiscoverySessions);
discoveryRouter.get('/', getAllDiscoverySessions);

export default discoveryRouter;