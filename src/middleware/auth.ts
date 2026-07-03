import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  admin?: {
    id: string;
    email: string;
    role: string;
  };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    return;
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    req.admin = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    return;
  }
};

export const superAdminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.admin?.role !== 'superAdmin') {
    res.status(403).json({ success: false, message: 'Access denied. Super Admin only.' });
    return;
  }
  next();
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.admin?.role !== 'admin' && req.admin?.role !== 'superAdmin') {
    res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
    return;
  }
  next();
};