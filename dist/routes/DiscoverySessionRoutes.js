"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DiscoverySessionController_1 = require("../controller/DiscoverySessionController");
// import { protect, admin } from '../middleware/authMiddleware';
const express_rate_limit_1 = require("express-rate-limit");
const discoveryRouter = express_1.default.Router();
// Rate limiting for public routes
const bookingLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 booking requests per 15 minutes
    message: 'Too many booking attempts, please try again after 15 minutes'
});
const availabilityLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // Limit each IP to 30 availability checks per minute
    message: 'Too many requests, please slow down'
});
// Public routes
discoveryRouter.post('/', bookingLimiter, DiscoverySessionController_1.createDiscoverySession);
discoveryRouter.post('/check-availability', availabilityLimiter, DiscoverySessionController_1.checkAvailability);
discoveryRouter.get('/available-slots', availabilityLimiter, DiscoverySessionController_1.getAvailableSlots);
// Protected routes (Admin only)
// discoveryRouter.get('/', protect, admin, getAllDiscoverySessions);
discoveryRouter.get('/', DiscoverySessionController_1.getAllDiscoverySessions);
exports.default = discoveryRouter;
