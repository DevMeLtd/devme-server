import { Request, Response } from 'express';
import { generateToken } from '../utils/jwtUtils.js';
import { AdminModel } from '../model/AdminModel.js';
import { AdminAuthRequest } from '../middleware/adminAuthMiddleware.js';

// Setup first superAdmin (first-time only)
export const setupAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Validate input
    if (!email || !password || !confirmPassword) {
      res.status(400).json({ 
        success: false,
        message: 'Email, password and confirm password are required' 
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ 
        success: false,
        message: 'Passwords do not match' 
      });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ 
        success: false,
        message: 'Password must be at least 8 characters long' 
      });
      return;
    }

    // Create superAdmin
    const admin = new AdminModel({
      email,
      password,
      role: 'superAdmin'
    });

    await admin.save();

    // Generate token
    const token = generateToken({
      adminId: admin._id.toString(),
      email: admin.email,
      role: admin.role
    });

    res.status(201).json({
      success: true,
      message: 'Super Admin setup successfully',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ 
        success: false,
        message: 'Email already exists' 
      });
      return;
    }
    res.status(500).json({ 
      success: false,
      message: error.message || 'Server error during setup'
    });
  }
};

// Create admin (only superAdmin can do this)
export const createAdmin = async (req: AdminAuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password, confirmPassword, role } = req.body;

    // Check if requester is superAdmin
    if (req.admin?.role !== 'superAdmin') {
      res.status(403).json({ 
        success: false,
        message: 'Access denied. Only Super Admin can create new admins.' 
      });
      return;
    }

    // Validate input
    if (!email || !password || !confirmPassword) {
      res.status(400).json({ 
        success: false,
        message: 'Email, password and confirm password are required' 
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ 
        success: false,
        message: 'Passwords do not match' 
      });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ 
        success: false,
        message: 'Password must be at least 8 characters long' 
      });
      return;
    }

    // Check if email already exists
    const existingAdmin = await AdminModel.findOne({ email });
    if (existingAdmin) {
      res.status(400).json({ 
        success: false,
        message: 'Email already exists' 
      });
      return;
    }

    // Create new admin
    const newAdmin = new AdminModel({
      email,
      password,
      role: role === 'superAdmin' ? 'superAdmin' : 'admin'
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: `Admin created successfully with ${newAdmin.role} role`,
      admin: {
        id: newAdmin._id,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      message: error.message || 'Server error while creating admin'
    });
  }
};

// Login admin
export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
      return;
    }

    const admin = await AdminModel.findOne({ email }).select('+password');

    if (!admin) {
      res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
      return;
    }

    const isPasswordValid = await admin.comparePassword(password);
    
    if (!isPasswordValid) {
      res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
      return;
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken({
      adminId: admin._id.toString(),
      email: admin.email,
      role: admin.role
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      message: error.message || 'Server error during login'
    });
  }
};

// Change password
export const changePassword = async (req: AdminAuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      res.status(400).json({ 
        success: false,
        message: 'All password fields are required' 
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({ 
        success: false,
        message: 'New passwords do not match' 
      });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ 
        success: false,
        message: 'New password must be at least 8 characters' 
      });
      return;
    }

    const admin = await AdminModel.findById(req.admin?.adminId).select('+password');

    if (!admin) {
      res.status(404).json({ 
        success: false,
        message: 'Admin not found' 
      });
      return;
    }

    // Verify current password
    const isPasswordValid = await admin.comparePassword(currentPassword);
    
    if (!isPasswordValid) {
      res.status(401).json({ 
        success: false,
        message: 'Current password is incorrect' 
      });
      return;
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      message: error.message || 'Server error changing password'
    });
  }
};

// Get all admins (only superAdmin)
export const getAllAdmins = async (req: AdminAuthRequest, res: Response): Promise<void> => {
  try {
    if (req.admin?.role !== 'superAdmin') {
      res.status(403).json({ 
        success: false,
        message: 'Access denied. Only Super Admin can view all admins.' 
      });
      return;
    }

    const admins = await AdminModel.find().select('-password');
    
    res.status(200).json({
      success: true,
      count: admins.length,
      admins
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      message: error.message || 'Server error fetching admins'
    });
  }
};

// Delete admin (only superAdmin)
export const deleteAdmin = async (req: AdminAuthRequest, res: Response): Promise<void> => {
  try {
    if (req.admin?.role !== 'superAdmin') {
      res.status(403).json({ 
        success: false,
        message: 'Access denied. Only Super Admin can delete admins.' 
      });
      return;
    }

    const adminId = req.params.id;
    
    // Prevent deleting self
    if (adminId === req.admin.adminId) {
      res.status(400).json({ 
        success: false,
        message: 'You cannot delete your own account' 
      });
      return;
    }

    const admin = await AdminModel.findById(adminId);
    
    if (!admin) {
      res.status(404).json({ 
        success: false,
        message: 'Admin not found' 
      });
      return;
    }

    // Prevent deleting the last super admin
    if (admin.role === 'superAdmin') {
      const superAdminCount = await AdminModel.countDocuments({ role: 'superAdmin' });
      if (superAdminCount <= 1) {
        res.status(400).json({ 
          success: false,
          message: 'Cannot delete the last Super Admin account' 
        });
        return;
      }
    }

    await admin.deleteOne();
    
    res.status(200).json({
      success: true,
      message: `${admin.role === 'superAdmin' ? 'Super Admin' : 'Admin'} deleted successfully`
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      message: error.message || 'Server error deleting admin'
    });
  }
};