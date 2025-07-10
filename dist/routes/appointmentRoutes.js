"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appointmentController_1 = require("../controller/appointmentController");
const appointRouter = express_1.default.Router();
appointRouter.post('/createappoint', appointmentController_1.createAppointment);
appointRouter.get('/getallappoint', appointmentController_1.getAllAppointments);
// appointRouter.patch('/:id/status', updateAppointmentStatus);
exports.default = appointRouter;
