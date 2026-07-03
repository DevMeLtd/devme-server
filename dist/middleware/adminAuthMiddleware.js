"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNoAdminExists = exports.requireSuperAdmin = exports.authenticateAdmin = void 0;
const jwtUtils_js_1 = require("../utils/jwtUtils.js");
const AdminModel_js_1 = require("../model/AdminModel.js");
// Authentication middleware
const authenticateAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = (0, jwtUtils_js_1.extractTokenFromHeader)(req);
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
            return;
        }
        const decoded = (0, jwtUtils_js_1.verifyToken)(token);
        // Verify admin still exists
        const admin = yield AdminModel_js_1.AdminModel.findById(decoded.adminId);
        if (!admin) {
            res.status(401).json({
                success: false,
                message: 'Admin account no longer exists'
            });
            return;
        }
        req.admin = {
            adminId: admin._id.toString(),
            email: admin.email,
            role: admin.role
        };
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({
                success: false,
                message: 'Session expired. Please login again.'
            });
            return;
        }
        res.status(401).json({
            success: false,
            message: 'Invalid authentication token'
        });
    }
});
exports.authenticateAdmin = authenticateAdmin;
// Check if admin is superAdmin
const requireSuperAdmin = (req, res, next) => {
    if (!req.admin || req.admin.role !== 'superAdmin') {
        res.status(403).json({
            success: false,
            message: 'Access denied. Super Admin privileges required.'
        });
        return;
    }
    next();
};
exports.requireSuperAdmin = requireSuperAdmin;
// Check if no admin exists (for setup)
const checkNoAdminExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminCount = yield AdminModel_js_1.AdminModel.countDocuments();
        if (adminCount > 0) {
            res.status(400).json({
                success: false,
                message: 'Admin already setup. Use login instead.'
            });
            return;
        }
        next();
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});
exports.checkNoAdminExists = checkNoAdminExists;
