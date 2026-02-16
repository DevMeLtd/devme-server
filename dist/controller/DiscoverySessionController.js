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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDiscoverySession = exports.updateDiscoverySession = exports.getDiscoverySessionById = exports.getAllDiscoverySessions = exports.createDiscoverySession = void 0;
const DiscoverySession_1 = __importDefault(require("../model/DiscoverySession"));
// @desc    Create a new discovery session booking
// @route   POST /discovery
// @access  Public
const createDiscoverySession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, appointmentDate, appointmentTime } = req.body;
        // Create booking
        const session = yield DiscoverySession_1.default.create({
            name,
            email,
            phone,
            appointmentDate: new Date(appointmentDate),
            appointmentTime
        });
        res.status(201).json({
            success: true,
            data: {
                id: session._id,
                name: session.name,
                email: session.email,
                phone: session.phone,
                appointmentDate: session.appointmentDate,
                appointmentTime: session.appointmentTime,
                createdAt: session.createdAt
            }
        });
    }
    catch (error) {
        console.error('Error creating discovery session:', error);
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err) => err.message);
            res.status(400).json({
                success: false,
                errors
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Failed to create booking. Please try again.'
        });
    }
});
exports.createDiscoverySession = createDiscoverySession;
// @desc    Get all discovery sessions (Admin only)
// @route   GET /discovery
// @access  Private/Admin
const getAllDiscoverySessions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sessions = yield DiscoverySession_1.default.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = yield DiscoverySession_1.default.countDocuments();
        res.status(200).json({
            success: true,
            data: {
                sessions,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    }
    catch (error) {
        console.error('Error fetching discovery sessions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sessions'
        });
    }
});
exports.getAllDiscoverySessions = getAllDiscoverySessions;
// @desc    Get single discovery session by ID
// @route   GET /discovery/:id
// @access  Private/Admin
const getDiscoverySessionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield DiscoverySession_1.default.findById(req.params.id);
        if (!session) {
            res.status(404).json({
                success: false,
                message: 'Session not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: session
        });
    }
    catch (error) {
        console.error('Error fetching discovery session:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch session'
        });
    }
});
exports.getDiscoverySessionById = getDiscoverySessionById;
// @desc    Update discovery session
// @route   PUT /discovery/:id
// @access  Private/Admin
const updateDiscoverySession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, appointmentDate, appointmentTime } = req.body;
        const session = yield DiscoverySession_1.default.findById(req.params.id);
        if (!session) {
            res.status(404).json({
                success: false,
                message: 'Session not found'
            });
            return;
        }
        // Update fields
        if (name)
            session.name = name;
        if (email)
            session.email = email;
        if (phone)
            session.phone = phone;
        if (appointmentDate)
            session.appointmentDate = new Date(appointmentDate);
        if (appointmentTime)
            session.appointmentTime = appointmentTime;
        yield session.save();
        res.status(200).json({
            success: true,
            data: session
        });
    }
    catch (error) {
        console.error('Error updating discovery session:', error);
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err) => err.message);
            res.status(400).json({
                success: false,
                errors
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Failed to update session'
        });
    }
});
exports.updateDiscoverySession = updateDiscoverySession;
// @desc    Delete discovery session
// @route   DELETE /discovery/:id
// @access  Private/Admin
const deleteDiscoverySession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield DiscoverySession_1.default.findById(req.params.id);
        if (!session) {
            res.status(404).json({
                success: false,
                message: 'Session not found'
            });
            return;
        }
        yield session.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Session deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting discovery session:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete session'
        });
    }
});
exports.deleteDiscoverySession = deleteDiscoverySession;
