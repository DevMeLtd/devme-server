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
exports.getApplicationStats = exports.deleteApplication = exports.updateApplicationStatus = exports.getApplicationById = exports.getAllApplications = exports.submitApplication = void 0;
const Application_1 = __importDefault(require("../model/Application"));
const emailService_1 = require("../services/emailService");
// @desc    Submit new application
// @route   POST /api/applications
// @access  Public
const submitApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applicationData = req.body;
        // Handle video submission
        if (req.file) {
            applicationData.submissionFile = req.file.path;
            applicationData.submissionType = 'Video';
            applicationData.submissionUrl = req.file.path;
        }
        else if (applicationData.submissionUrl) {
            applicationData.submissionType = 'Link';
        }
        // Create application
        const application = yield Application_1.default.create(applicationData);
        // Send confirmation email to parent/guardian
        try {
            yield (0, emailService_1.sendApplicationConfirmation)({
                email: application.parentEmail,
                parentName: application.parentName,
                childName: `${application.firstName} ${application.lastName}`,
                applicationTrack: application.applicationTrack
            });
            console.log('Confirmation email sent to parent:', application.parentEmail);
        }
        catch (emailError) {
            console.error('Email sending failed:', emailError);
        }
        // Send admin notification
        try {
            const adminEmail = process.env.EMAIL_USER || 'devmeltd@gmail.com';
            yield (0, emailService_1.sendAdminNotification)({
                adminEmail: adminEmail,
                childName: `${application.firstName} ${application.lastName}`,
                parentName: application.parentName,
                applicationTrack: application.applicationTrack,
                applicationId: application._id.toString()
            });
            console.log('Admin notification sent to:', adminEmail);
        }
        catch (emailError) {
            console.error('Admin notification failed:', emailError);
        }
        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            application
        });
    }
    catch (error) {
        console.error('Application submission error:', error);
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err) => err.message);
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
});
exports.submitApplication = submitApplication;
// @desc    Get all applications (Admin only)
// @route   GET /api/applications
// @access  Private/Admin
const getAllApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract query parameters with defaults
        const { status, track, page = 1, limit = 20, search, sortBy = 'appliedAt', sortOrder = 'desc' } = req.query;
        // Build filter query
        const query = {};
        // Filter by status
        if (status) {
            const validStatuses = ['pending', 'shortlisted', 'accepted', 'rejected'];
            if (validStatuses.includes(status)) {
                query.status = status;
            }
        }
        // Filter by application track
        if (track) {
            const validTracks = ['The Science Wiz', 'The Creative'];
            if (validTracks.includes(track)) {
                query.applicationTrack = track;
            }
        }
        // Search functionality
        if (search) {
            const searchRegex = { $regex: search, $options: 'i' };
            query.$or = [
                { firstName: searchRegex },
                { lastName: searchRegex },
                { parentEmail: searchRegex },
                { applicantEmail: searchRegex },
                { schoolName: searchRegex },
                { applicantPhone: { $regex: search, $options: 'i' } }
            ];
        }
        // Calculate pagination
        const pageNumber = Math.max(1, Number(page));
        const limitNumber = Math.min(100, Math.max(1, Number(limit))); // Max 100 items per page
        const skip = (pageNumber - 1) * limitNumber;
        // Build sort object
        const sortObject = {};
        const validSortFields = ['appliedAt', 'firstName', 'lastName', 'status', 'applicationTrack'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'appliedAt';
        sortObject[sortField] = sortOrder === 'asc' ? 1 : -1;
        // Execute queries in parallel
        const [applications, total] = yield Promise.all([
            Application_1.default.find(query)
                .sort(sortObject)
                .skip(skip)
                .limit(limitNumber)
                .select('-__v') // Exclude version field
                .lean(), // Return plain JavaScript objects for better performance
            Application_1.default.countDocuments(query)
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
    }
    catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve applications',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.getAllApplications = getAllApplications;
// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private/Admin
const getApplicationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const application = yield Application_1.default.findById(req.params.id);
        if (!application) {
            res.status(404).json({ success: false, message: 'Application not found' });
            return;
        }
        res.status(200).json({ success: true, application });
    }
    catch (error) {
        console.error('Get application error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
exports.getApplicationById = getApplicationById;
// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
const updateApplicationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, adminNotes } = req.body;
        if (!status || !['pending', 'shortlisted', 'accepted', 'rejected'].includes(status)) {
            res.status(400).json({ success: false, message: 'Valid status is required' });
            return;
        }
        const application = yield Application_1.default.findById(req.params.id);
        if (!application) {
            res.status(404).json({ success: false, message: 'Application not found' });
            return;
        }
        const previousStatus = application.status;
        application.status = status;
        if (adminNotes)
            application.adminNotes = adminNotes;
        yield application.save();
        // Send email notification to parent/guardian when status changes to shortlisted or accepted
        if ((status === 'shortlisted' || status === 'accepted') && status !== previousStatus) {
            try {
                yield (0, emailService_1.sendStatusUpdateEmail)({
                    email: application.parentEmail,
                    parentName: application.parentName,
                    childName: `${application.firstName} ${application.lastName}`,
                    status: status,
                    applicationTrack: application.applicationTrack,
                    adminNotes: adminNotes
                });
                console.log(`Status update email sent to parent for ${status}:`, application.parentEmail);
            }
            catch (emailError) {
                console.error('Status update email failed:', emailError);
                // Don't fail the request if email fails
            }
        }
        res.status(200).json({
            success: true,
            message: `Application ${status} successfully`,
            application
        });
    }
    catch (error) {
        console.error('Update application status error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
exports.updateApplicationStatus = updateApplicationStatus;
// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private/Admin
const deleteApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const application = yield Application_1.default.findById(req.params.id);
        if (!application) {
            res.status(404).json({ success: false, message: 'Application not found' });
            return;
        }
        yield application.deleteOne();
        res.status(200).json({ success: true, message: 'Application deleted successfully' });
    }
    catch (error) {
        console.error('Delete application error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
exports.deleteApplication = deleteApplication;
// @desc    Get application statistics
// @route   GET /api/applications/stats/summary
// @access  Private/Admin
const getApplicationStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const total = yield Application_1.default.countDocuments();
        const pending = yield Application_1.default.countDocuments({ status: 'pending' });
        const shortlisted = yield Application_1.default.countDocuments({ status: 'shortlisted' });
        const accepted = yield Application_1.default.countDocuments({ status: 'accepted' });
        const rejected = yield Application_1.default.countDocuments({ status: 'rejected' });
        const byTrack = yield Application_1.default.aggregate([
            { $group: { _id: '$applicationTrack', count: { $sum: 1 } } }
        ]);
        const byState = yield Application_1.default.aggregate([
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
    }
    catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
exports.getApplicationStats = getApplicationStats;
