import { Request, Response } from 'express';
import { sendConfirmationEmail } from '../services/emailService';
import AppointmentModel, { IAppointment } from '../model/AppointmentModel';

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const appointmentData: IAppointment = req.body;
    const newAppointment = new AppointmentModel(appointmentData);
    await newAppointment.save();

    // Send confirmation email
    await sendConfirmationEmail({
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
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to book appointment'
    });
  }
};

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await AppointmentModel.find().sort({ appointmentDate: 1 });
    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments'
    });
  }
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const appointment = await AppointmentModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

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
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update appointment'
    });
  }
};