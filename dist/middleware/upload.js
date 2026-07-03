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
exports.uploadImage = exports.uploadVideo = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_js_1 = __importDefault(require("../config/cloudinary.js"));
// Configure Cloudinary storage for videos
const videoStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_js_1.default,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        return {
            folder: 'futureproof/applications',
            resource_type: 'video',
            allowed_formats: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
            max_bytes: 50 * 1024 * 1024 // 50MB
        };
    })
});
// Configure Cloudinary storage for images
const imageStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_js_1.default,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        return {
            folder: 'futureproof/uploads',
            resource_type: 'auto',
            allowed_formats: ['jpg', 'png', 'jpeg', 'gif']
        };
    })
});
// upload video
const uploadVideo = (req, res, next) => {
    const upload = (0, multer_1.default)({
        storage: videoStorage,
        limits: {
            fileSize: 50 * 1024 * 1024,
            files: 1
        },
        fileFilter: (req, file, cb) => {
            console.log('File received:', {
                fieldname: file.fieldname,
                mimetype: file.mimetype,
                originalname: file.originalname,
                size: file.size
            });
            if (file.mimetype.startsWith('video/')) {
                cb(null, true);
            }
            else {
                cb(new Error(`Only video files are allowed. Received: ${file.mimetype}`));
            }
        }
    }).single('submissionFile');
    upload(req, res, (err) => {
        if (err) {
            console.error('Upload error:', {
                name: err.name,
                code: err.code,
                field: err.field,
                message: err.message
            });
            // Handle specific multer errors
            if (err instanceof multer_1.default.MulterError) {
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
exports.uploadVideo = uploadVideo;
// upload image
exports.uploadImage = (0, multer_1.default)({
    storage: imageStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
}).single('image');
