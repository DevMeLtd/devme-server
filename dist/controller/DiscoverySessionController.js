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
exports.getAllDiscoverySessions = exports.getAvailableSlots = exports.checkAvailability = exports.createDiscoverySession = void 0;
const DiscoverySession_1 = __importDefault(require("../model/DiscoverySession"));
// import DiscoverySession, { IDiscoverySession } from '../models/DiscoverySession';
// @desc    Create a new discovery session booking
// @route   POST /api/discovery-sessions
// @access  Public
const createDiscoverySession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, appointmentDate, appointmentTime } = req.body;
        // Check if slot is already booked
        const existingBooking = yield DiscoverySession_1.default.findOne({
            appointmentDate: new Date(appointmentDate),
            appointmentTime
        });
        if (existingBooking) {
            res.status(409).json({
                success: false,
                message: 'This time slot is already booked. Please select another time.'
            });
            return;
        }
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
                appointmentTime: session.appointmentTime
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
// @desc    Check if a specific time slot is available
// @route   POST /api/discovery-sessions/check-availability
// @access  Public
const checkAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, time } = req.body;
        if (!date || !time) {
            res.status(400).json({
                success: false,
                message: 'Date and time are required'
            });
            return;
        }
        const existingBooking = yield DiscoverySession_1.default.findOne({
            appointmentDate: new Date(date),
            appointmentTime: time
        });
        res.status(200).json({
            success: true,
            data: {
                date,
                time,
                available: !existingBooking
            }
        });
    }
    catch (error) {
        console.error('Error checking availability:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check availability'
        });
    }
});
exports.checkAvailability = checkAvailability;
// @desc    Get all available time slots for a specific date
// @route   GET /api/discovery-sessions/available-slots
// @access  Public
const getAvailableSlots = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date } = req.query;
        if (!date) {
            res.status(400).json({
                success: false,
                message: 'Date is required'
            });
            return;
        }
        const allTimeSlots = [
            "09:00 AM", "10:00 AM", "11:00 AM",
            "12:00 PM", "01:00 PM", "02:00 PM",
            "03:00 PM", "04:00 PM", "05:00 PM"
        ];
        // Find booked slots for the date
        const bookedSessions = yield DiscoverySession_1.default.find({
            appointmentDate: new Date(date),
            appointmentTime: { $in: allTimeSlots }
        });
        const bookedSlots = bookedSessions.map(session => session.appointmentTime);
        const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));
        res.status(200).json({
            success: true,
            data: {
                date,
                availableSlots,
                bookedSlots
            }
        });
    }
    catch (error) {
        console.error('Error fetching available slots:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch available slots'
        });
    }
});
exports.getAvailableSlots = getAvailableSlots;
// @desc    Get all discovery sessions (Admin only)
// @route   GET /api/discovery-sessions
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
