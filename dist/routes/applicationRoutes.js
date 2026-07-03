"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const applicationcontroller_1 = require("../controller/applicationcontroller");
// import { protect, adminOnly } from '../middleware/auth.js';
const upload_js_1 = require("../middleware/upload.js");
const adminAuthMiddleware_1 = require("../middleware/adminAuthMiddleware");
const futureRouter = express_1.default.Router();
// Public route
futureRouter.post('/', upload_js_1.uploadVideo, applicationcontroller_1.submitApplication);
// Admin only routes
futureRouter.use(adminAuthMiddleware_1.authenticateAdmin);
// futureRouter.use(adminOnly);
futureRouter.get('/getall', applicationcontroller_1.getAllApplications);
futureRouter.get('/stats/summary', applicationcontroller_1.getApplicationStats);
futureRouter.get('/getone/:id', applicationcontroller_1.getApplicationById);
futureRouter.put('/:id/status', applicationcontroller_1.updateApplicationStatus);
futureRouter.delete('/delete/:id', applicationcontroller_1.deleteApplication);
exports.default = futureRouter;
