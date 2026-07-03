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
exports.deleteAdmin = exports.getAllAdmins = exports.changePassword = exports.loginAdmin = exports.createAdmin = exports.setupAdmin = void 0;
const jwtUtils_js_1 = require("../utils/jwtUtils.js");
const AdminModel_js_1 = require("../model/AdminModel.js");
// Setup first superAdmin (first-time only)
const setupAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, confirmPassword } = req.body;
        // Validate input
        if (!email || !password || !confirmPassword) {
            res.status(400).json({
                success: false,
                message: 'Email, password and confirm password are required'
            });
            return;
        }
        if (password !== confirmPassword) {
            res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
            return;
        }
        if (password.length < 8) {
            res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
            return;
        }
        // Create superAdmin
        const admin = new AdminModel_js_1.AdminModel({
            email,
            password,
            role: 'superAdmin'
        });
        yield admin.save();
        // Generate token
        const token = (0, jwtUtils_js_1.generateToken)({
            adminId: admin._id.toString(),
            email: admin.email,
            role: admin.role
        });
        res.status(201).json({
            success: true,
            message: 'Super Admin setup successfully',
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                role: admin.role
            }
        });
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during setup'
        });
    }
});
exports.setupAdmin = setupAdmin;
// Create admin (only superAdmin can do this)
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email, password, confirmPassword, role } = req.body;
        // Check if requester is superAdmin
        if (((_a = req.admin) === null || _a === void 0 ? void 0 : _a.role) !== 'superAdmin') {
            res.status(403).json({
                success: false,
                message: 'Access denied. Only Super Admin can create new admins.'
            });
            return;
        }
        // Validate input
        if (!email || !password || !confirmPassword) {
            res.status(400).json({
                success: false,
                message: 'Email, password and confirm password are required'
            });
            return;
        }
        if (password !== confirmPassword) {
            res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
            return;
        }
        if (password.length < 8) {
            res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
            return;
        }
        // Check if email already exists
        const existingAdmin = yield AdminModel_js_1.AdminModel.findOne({ email });
        if (existingAdmin) {
            res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
            return;
        }
        // Create new admin
        const newAdmin = new AdminModel_js_1.AdminModel({
            email,
            password,
            role: role === 'superAdmin' ? 'superAdmin' : 'admin'
        });
        yield newAdmin.save();
        res.status(201).json({
            success: true,
            message: `Admin created successfully with ${newAdmin.role} role`,
            admin: {
                id: newAdmin._id,
                email: newAdmin.email,
                role: newAdmin.role
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while creating admin'
        });
    }
});
exports.createAdmin = createAdmin;
// Login admin
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
            return;
        }
        const admin = yield AdminModel_js_1.AdminModel.findOne({ email }).select('+password');
        if (!admin) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
            return;
        }
        const isPasswordValid = yield admin.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
            return;
        }
        // Update last login
        admin.lastLogin = new Date();
        yield admin.save();
        // Generate token
        const token = (0, jwtUtils_js_1.generateToken)({
            adminId: admin._id.toString(),
            email: admin.email,
            role: admin.role
        });
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                role: admin.role
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during login'
        });
    }
});
exports.loginAdmin = loginAdmin;
// Change password
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        if (!currentPassword || !newPassword || !confirmPassword) {
            res.status(400).json({
                success: false,
                message: 'All password fields are required'
            });
            return;
        }
        if (newPassword !== confirmPassword) {
            res.status(400).json({
                success: false,
                message: 'New passwords do not match'
            });
            return;
        }
        if (newPassword.length < 8) {
            res.status(400).json({
                success: false,
                message: 'New password must be at least 8 characters'
            });
            return;
        }
        const admin = yield AdminModel_js_1.AdminModel.findById((_a = req.admin) === null || _a === void 0 ? void 0 : _a.adminId).select('+password');
        if (!admin) {
            res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
            return;
        }
        // Verify current password
        const isPasswordValid = yield admin.comparePassword(currentPassword);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
            return;
        }
        // Update password
        admin.password = newPassword;
        yield admin.save();
        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error changing password'
        });
    }
});
exports.changePassword = changePassword;
// Get all admins (only superAdmin)
const getAllAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.admin) === null || _a === void 0 ? void 0 : _a.role) !== 'superAdmin') {
            res.status(403).json({
                success: false,
                message: 'Access denied. Only Super Admin can view all admins.'
            });
            return;
        }
        const admins = yield AdminModel_js_1.AdminModel.find().select('-password');
        res.status(200).json({
            success: true,
            count: admins.length,
            admins
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error fetching admins'
        });
    }
});
exports.getAllAdmins = getAllAdmins;
// Delete admin (only superAdmin)
const deleteAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.admin) === null || _a === void 0 ? void 0 : _a.role) !== 'superAdmin') {
            res.status(403).json({
                success: false,
                message: 'Access denied. Only Super Admin can delete admins.'
            });
            return;
        }
        const adminId = req.params.id;
        // Prevent deleting self
        if (adminId === req.admin.adminId) {
            res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
            return;
        }
        const admin = yield AdminModel_js_1.AdminModel.findById(adminId);
        if (!admin) {
            res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
            return;
        }
        // Prevent deleting the last super admin
        if (admin.role === 'superAdmin') {
            const superAdminCount = yield AdminModel_js_1.AdminModel.countDocuments({ role: 'superAdmin' });
            if (superAdminCount <= 1) {
                res.status(400).json({
                    success: false,
                    message: 'Cannot delete the last Super Admin account'
                });
                return;
            }
        }
        yield admin.deleteOne();
        res.status(200).json({
            success: true,
            message: `${admin.role === 'superAdmin' ? 'Super Admin' : 'Admin'} deleted successfully`
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error deleting admin'
        });
    }
});
exports.deleteAdmin = deleteAdmin;
