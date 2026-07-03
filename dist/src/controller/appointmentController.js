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
exports.updateAppointmentStatus = exports.getAllAppointments = exports.createAppointment = void 0;
const emailService_1 = require("../services/emailService");
const AppointmentModel_1 = __importDefault(require("../model/AppointmentModel"));
const createAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointmentData = req.body;
        const newAppointment = new AppointmentModel_1.default(appointmentData);
        yield newAppointment.save();
        // Send confirmation email
        yield (0, emailService_1.sendConfirmationEmail)({
            email: newAppointment.email,
            parentName: newAppointment.parentName,
            appointmentDate: newAppointment.appointmentDate,
            childName: newAppointment.childName
        });
        res.status(201).json({
            success: true,
            data: newAppointment,
            message: 'Appointment booked successfully!'
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to book appointment'
        });
    }
});
exports.createAppointment = createAppointment;
const getAllAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointments = yield AppointmentModel_1.default.find().sort({ appointmentDate: 1 });
        res.status(200).json({
            success: true,
            data: appointments
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointments'
        });
    }
});
exports.getAllAppointments = getAllAppointments;
const updateAppointmentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const appointment = yield AppointmentModel_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        res.status(200).json({
            success: true,
            data: appointment
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to update appointment'
        });
    }
});
exports.updateAppointmentStatus = updateAppointmentStatus;
