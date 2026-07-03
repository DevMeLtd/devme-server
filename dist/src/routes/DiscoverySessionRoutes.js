"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DiscoverySessionController_1 = require("../controller/DiscoverySessionController");
// import { protect, admin } from '../middleware/authMiddleware';
const discoveryRouter = express_1.default.Router();
// Public route
discoveryRouter.post('/', DiscoverySessionController_1.createDiscoverySession);
// Protected routes (Admin only) - Uncomment protect and admin when ready
// discoveryRouter.get('/', protect, admin, getAllDiscoverySessions);
// discoveryRouter.get('/:id', protect, admin, getDiscoverySessionById);
// discoveryRouter.put('/:id', protect, admin, updateDiscoverySession);
// discoveryRouter.delete('/:id', protect, admin, deleteDiscoverySession);
// For now, public for testing
discoveryRouter.get('/', DiscoverySessionController_1.getAllDiscoverySessions);
discoveryRouter.get('/:id', DiscoverySessionController_1.getDiscoverySessionById);
discoveryRouter.put('/:id', DiscoverySessionController_1.updateDiscoverySession);
discoveryRouter.delete('/:id', DiscoverySessionController_1.deleteDiscoverySession);
exports.default = discoveryRouter;
