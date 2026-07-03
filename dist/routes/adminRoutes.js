"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_js_1 = require("../controller/adminController.js");
const adminAuthMiddleware_js_1 = require("../middleware/adminAuthMiddleware.js");
const adminRouter = (0, express_1.Router)();
// Public routes
adminRouter.post('/setup', adminAuthMiddleware_js_1.checkNoAdminExists, adminController_js_1.setupAdmin);
adminRouter.post('/login', adminController_js_1.loginAdmin);
// Protected routes (require authentication)
adminRouter.use(adminAuthMiddleware_js_1.authenticateAdmin);
adminRouter.post('/change-password', adminController_js_1.changePassword);
// Super Admin only routes
adminRouter.post('/create', adminAuthMiddleware_js_1.requireSuperAdmin, adminController_js_1.createAdmin);
adminRouter.get('/all', adminAuthMiddleware_js_1.requireSuperAdmin, adminController_js_1.getAllAdmins);
adminRouter.delete('/delete/:id', adminAuthMiddleware_js_1.requireSuperAdmin, adminController_js_1.deleteAdmin);
exports.default = adminRouter;
