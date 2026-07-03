import multer, { FileFilterCallback } from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import { Response, Request, NextFunction } from 'express';

// Configure Cloudinary storage for videos
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'futureproof/applications',
      resource_type: 'video',
      allowed_formats: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
      max_bytes: 50 * 1024 * 1024 // 50MB
    };
  }
});

// Configure Cloudinary storage for images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'futureproof/uploads',
      resource_type: 'auto',
      allowed_formats: ['jpg', 'png', 'jpeg', 'gif']
    };
  }
});

// upload video
export const uploadVideo = (req: Request, res: Response, next: NextFunction) => {
  const upload = multer({
    storage: videoStorage,
    limits: { 
      fileSize: 50 * 1024 * 1024,
      files: 1
    },
    fileFilter: (req, file, cb: FileFilterCallback) => {
      console.log('File received:', {
        fieldname: file.fieldname,
        mimetype: file.mimetype,
        originalname: file.originalname,
        size: file.size
      });
      
      if (file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(new Error(`Only video files are allowed. Received: ${file.mimetype}`));
      }
    }
  }).single('submissionFile');

  upload(req, res, (err: any) => {
    if (err) {
      console.error('Upload error:', {
        name: err.name,
        code: err.code,
        field: err.field,
        message: err.message
      });

      // Handle specific multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File is too large. Maximum size is 50MB.'
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            success: false,
            message: `Field name mismatch. Expected 'submissionVideo' but received '${err.field}'. Please check your form field name.`
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            message: 'Only one video file is allowed'
          });
        }
      }
      
      // Handle other errors
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed'
      });
    }
    
    // Log successful upload
    if (req.file) {
      console.log('File uploaded successfully:', {
        fieldname: req.file.fieldname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
      });
    }
    
    next();
  });
};


// upload image
export const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed') as any, false);
    }
  }
}).single('image');