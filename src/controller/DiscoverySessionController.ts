import { Request, Response } from 'express';
import DiscoverySession from '../model/DiscoverySession';
// import DiscoverySession, { IDiscoverySession } from '../models/DiscoverySession';

// @desc    Create a new discovery session booking
// @route   POST /api/discovery-sessions
// @access  Public
export const createDiscoverySession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, appointmentDate, appointmentTime } = req.body;

    // Check if slot is already booked
    const existingBooking = await DiscoverySession.findOne({
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
    const session = await DiscoverySession.create({
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

  } catch (error: any) {
    console.error('Error creating discovery session:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
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
};

// @desc    Check if a specific time slot is available
// @route   POST /api/discovery-sessions/check-availability
// @access  Public
export const checkAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, time } = req.body;

    if (!date || !time) {
      res.status(400).json({
        success: false,
        message: 'Date and time are required'
      });
      return;
    }

    const existingBooking = await DiscoverySession.findOne({
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

  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check availability'
    });
  }
};

// @desc    Get all available time slots for a specific date
// @route   GET /api/discovery-sessions/available-slots
// @access  Public
export const getAvailableSlots = async (req: Request, res: Response): Promise<void> => {
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
    const bookedSessions = await DiscoverySession.find({
      appointmentDate: new Date(date as string),
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

  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available slots'
    });
  }
};

// @desc    Get all discovery sessions (Admin only)
// @route   GET /api/discovery-sessions
// @access  Private/Admin
export const getAllDiscoverySessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const sessions = await DiscoverySession.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await DiscoverySession.countDocuments();

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

  } catch (error) {
    console.error('Error fetching discovery sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sessions'
    });
  }
};