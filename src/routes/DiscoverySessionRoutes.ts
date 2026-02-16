import express from 'express';
import {
  createDiscoverySession,
  getAllDiscoverySessions,
  getDiscoverySessionById,
  updateDiscoverySession,
  deleteDiscoverySession
} from '../controller/DiscoverySessionController';
// import { protect, admin } from '../middleware/authMiddleware';

const discoveryRouter = express.Router();

// Public route
discoveryRouter.post('/', createDiscoverySession);

// Protected routes (Admin only) - Uncomment protect and admin when ready
// discoveryRouter.get('/', protect, admin, getAllDiscoverySessions);
// discoveryRouter.get('/:id', protect, admin, getDiscoverySessionById);
// discoveryRouter.put('/:id', protect, admin, updateDiscoverySession);
// discoveryRouter.delete('/:id', protect, admin, deleteDiscoverySession);

// For now, public for testing
discoveryRouter.get('/', getAllDiscoverySessions);
discoveryRouter.get('/:id', getDiscoverySessionById);
discoveryRouter.put('/:id', updateDiscoverySession);
discoveryRouter.delete('/:id', deleteDiscoverySession);

export default discoveryRouter;