import { Request, Response } from 'express';
import DiscoverySession from '../model/DiscoverySession';


// Helper function to parse various date formats
const parseDate = (dateStr: string): Date | null => {
  // If already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(dateStr);
  }
  
  // Handle DD-MM-YYYY format
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('-');
    return new Date(`${year}-${month}-${day}`);
  }
  
  // Handle DD/MM/YYYY format
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`);
  }
  
  return null;
};

// @desc    Create a new discovery session booking
// @route   POST /discovery
// @access  Public
export const createDiscoverySession = async (req: Request, res: Response): Promise<void> => {
  try {
    let { name, email, phone, appointmentDate, appointmentTime } = req.body;

    // Parse the date
    const parsedDate = parseDate(appointmentDate);
    
    if (!parsedDate) {
      res.status(400).json({
        success: false,
        errors: ['Invalid date format. Please use YYYY-MM-DD, DD-MM-YYYY, or DD/MM/YYYY']
      });
      return;
    }

    // Create booking with parsed date
    const session = await DiscoverySession.create({
      name,
      email,
      phone,
      appointmentDate: parsedDate,
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

  } catch (error: any) {
    console.error('Error creating discovery session:', error);
    
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

// @desc    Get all discovery sessions (Admin only)
// @route   GET /discovery
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

// @desc    Get single discovery session by ID
// @route   GET /discovery/:id
// @access  Private/Admin
export const getDiscoverySessionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await DiscoverySession.findById(req.params.id);

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

  } catch (error) {
    console.error('Error fetching discovery session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch session'
    });
  }
};

// @desc    Update discovery session
// @route   PUT /discovery/:id
// @access  Private/Admin
export const updateDiscoverySession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, appointmentDate, appointmentTime } = req.body;

    const session = await DiscoverySession.findById(req.params.id);

    if (!session) {
      res.status(404).json({
        success: false,
        message: 'Session not found'
      });
      return;
    }

    // Update fields
    if (name) session.name = name;
    if (email) session.email = email;
    if (phone) session.phone = phone;
    if (appointmentDate) session.appointmentDate = new Date(appointmentDate);
    if (appointmentTime) session.appointmentTime = appointmentTime;

    await session.save();

    res.status(200).json({
      success: true,
      data: session
    });

  } catch (error: any) {
    console.error('Error updating discovery session:', error);
    
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
      message: 'Failed to update session'
    });
  }
};

// @desc    Delete discovery session
// @route   DELETE /discovery/:id
// @access  Private/Admin
export const deleteDiscoverySession = async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await DiscoverySession.findById(req.params.id);

    if (!session) {
      res.status(404).json({
        success: false,
        message: 'Session not found'
      });
      return;
    }

    await session.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Session deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting discovery session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete session'
    });
  }
};