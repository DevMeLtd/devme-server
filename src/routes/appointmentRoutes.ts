import express from 'express';
import { createAppointment, getAllAppointments } from '../controller/appointmentController';

const appointRouter = express.Router();

appointRouter.post('/createappoint', createAppointment);
appointRouter.get('/getallappoint', getAllAppointments);
// appointRouter.patch('/:id/status', updateAppointmentStatus);

export default appointRouter;