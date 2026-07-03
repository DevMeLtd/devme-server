"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.superAdminOnly = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized to access this route' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        req.admin = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };
        next();
    }
    catch (error) {
        res.status(401).json({ success: false, message: 'Not authorized to access this route' });
        return;
    }
};
exports.protect = protect;
const superAdminOnly = (req, res, next) => {
    var _a;
    if (((_a = req.admin) === null || _a === void 0 ? void 0 : _a.role) !== 'superAdmin') {
        res.status(403).json({ success: false, message: 'Access denied. Super Admin only.' });
        return;
    }
    next();
};
exports.superAdminOnly = superAdminOnly;
const adminOnly = (req, res, next) => {
    var _a, _b;
    if (((_a = req.admin) === null || _a === void 0 ? void 0 : _a.role) !== 'admin' && ((_b = req.admin) === null || _b === void 0 ? void 0 : _b.role) !== 'superAdmin') {
        res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
        return;
    }
    next();
};
exports.adminOnly = adminOnly;
