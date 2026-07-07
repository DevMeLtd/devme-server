import { Request, Response } from 'express';
import Application from '../model/Application';
import { AuthRequest } from '../middleware/auth.js';
import { sendAdminNotification, sendApplicationConfirmation, sendStatusUpdateEmail } from '../services/emailService'

// @desc    Submit new application
// @route   POST /api/applications
// @access  Public
export const submitApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const applicationData = req.body;
    
    // Handle video submission
    if (req.file) {
      applicationData.submissionFile = req.file.path;
      applicationData.submissionType = 'Video';
      applicationData.submissionUrl = req.file.path;
    } else if (applicationData.submissionUrl) {
      applicationData.submissionType = 'Link';
    }
    
    // Create application
    const application = await Application.create(applicationData);
    
    // Send confirmation email to parent/guardian
    try {
      await sendApplicationConfirmation({
        email: application.parentEmail,
        parentName: application.parentName,
        childName: `${application.firstName} ${application.lastName}`,
        applicationTrack: application.applicationTrack
      });
      console.log('Confirmation email sent to parent:', application.parentEmail);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }
    
    // Send admin notification
    try {
      const adminEmail = process.env.EMAIL_USER || 'devmeltd@gmail.com';
      await sendAdminNotification({
        adminEmail: adminEmail,
        childName: `${application.firstName} ${application.lastName}`,
        parentName: application.parentName,
        applicationTrack: application.applicationTrack,
        applicationId: application._id.toString()
      });
      console.log('Admin notification sent to:', adminEmail);
    } catch (emailError) {
      console.error('Admin notification failed:', emailError);
    }
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    });
  } catch (error: any) {
    console.error('Application submission error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors 
      });
      return;
    }
    
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Duplicate application detected'
      });
      return;
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error while submitting application' 
    });
  }
};

// @desc    Get all applications (Admin only)
// @route   GET /api/applications
// @access  Private/Admin
export const getAllApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Extract query parameters with defaults
    const { 
      status, 
      track, 
      page = 1, 
      limit = 20, 
      search,
      sortBy = 'appliedAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build filter query
    const query: any = {};
    
    // Filter by status
    if (status) {
      const validStatuses = ['pending', 'shortlisted', 'accepted', 'rejected'];
      if (validStatuses.includes(status as string)) {
        query.status = status;
      }
    }
    
    // Filter by application track
    if (track) {
      const validTracks = ['The Science Wiz', 'The Creative'];
      if (validTracks.includes(track as string)) {
        query.applicationTrack = track;
      }
    }
    
    // Search functionality
    if (search) {
      const searchRegex = { $regex: search as string, $options: 'i' };
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { parentEmail: searchRegex },
        { applicantEmail: searchRegex },
        { schoolName: searchRegex },
        { applicantPhone: { $regex: search as string, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.min(100, Math.max(1, Number(limit))); // Max 100 items per page
    const skip = (pageNumber - 1) * limitNumber;
    
    // Build sort object
    const sortObject: any = {};
    const validSortFields = ['appliedAt', 'firstName', 'lastName', 'status', 'applicationTrack'];
    const sortField = validSortFields.includes(sortBy as string) ? sortBy : 'appliedAt';
    sortObject[sortField as string] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute queries in parallel
    const [applications, total] = await Promise.all([
      Application.find(query)
        .sort(sortObject)
        .skip(skip)
        .limit(limitNumber)
        .select('-__v') // Exclude version field
        .lean(), // Return plain JavaScript objects for better performance
      Application.countDocuments(query)
    ]);
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;
    
    res.status(200).json({
      success: true,
      data: {
        applications,
        pagination: {
          currentPage: pageNumber,
          itemsPerPage: limitNumber,
          totalItems: total,
          totalPages: totalPages,
          hasNextPage,
          hasPrevPage,
          nextPage: hasNextPage ? pageNumber + 1 : null,
          prevPage: hasPrevPage ? pageNumber - 1 : null
        },
        filters: {
          status: status || 'all',
          track: track || 'all',
          search: search || ''
        }
      }
    });
  } catch (error: any) {
    console.error('Get applications error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve applications',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private/Admin
export const getApplicationById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }
    
    res.status(200).json({ success: true, application });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
export const updateApplicationStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, adminNotes } = req.body;
    
    if (!status || !['pending', 'shortlisted', 'accepted', 'rejected'].includes(status)) {
      res.status(400).json({ success: false, message: 'Valid status is required' });
      return;
    }
    
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }
    
    const previousStatus = application.status;
    application.status = status;
    if (adminNotes) application.adminNotes = adminNotes;
    
    await application.save();
    
    // Send email notification to parent/guardian when status changes to shortlisted or accepted
    if ((status === 'shortlisted' || status === 'accepted') && status !== previousStatus) {
      try {
        await sendStatusUpdateEmail({
          email: application.parentEmail,
          parentName: application.parentName,
          childName: `${application.firstName} ${application.lastName}`,
          status: status,
          applicationTrack: application.applicationTrack,
          adminNotes: adminNotes
        });
        console.log(`Status update email sent to parent for ${status}:`, application.parentEmail);
      } catch (emailError) {
        console.error('Status update email failed:', emailError);
        // Don't fail the request if email fails
      }
    }
    
    res.status(200).json({ 
      success: true, 
      message: `Application ${status} successfully`,
      application 
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private/Admin
export const deleteApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }
    
    await application.deleteOne();
    
    res.status(200).json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get application statistics
// @route   GET /api/applications/stats/summary
// @access  Private/Admin
export const getApplicationStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const total = await Application.countDocuments();
    const pending = await Application.countDocuments({ status: 'pending' });
    const shortlisted = await Application.countDocuments({ status: 'shortlisted' });
    const accepted = await Application.countDocuments({ status: 'accepted' });
    const rejected = await Application.countDocuments({ status: 'rejected' });
    
    const byTrack = await Application.aggregate([
      { $group: { _id: '$applicationTrack', count: { $sum: 1 } } }
    ]);
    
    const byState = await Application.aggregate([
      { $group: { _id: '$stateOfResidence', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        shortlisted,
        accepted,
        rejected,
        byTrack,
        byState
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};