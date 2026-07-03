"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ApplicationSchema = new mongoose_1.Schema({
    // Section A - About You
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: [true, 'Gender is required']
    },
    stateOfOrigin: {
        type: String,
        required: [true, 'State of origin is required']
    },
    // Section B - Your School
    schoolName: {
        type: String,
        required: [true, 'School name is required'],
        trim: true
    },
    schoolType: {
        type: String,
        enum: ['Public', 'Private'],
        required: [true, 'School type is required']
    },
    currentClass: {
        type: String,
        required: [true, 'Current class is required']
    },
    // Section C - Contact Details
    applicantPhone: {
        type: String,
        required: [true, 'Applicant phone number is required']
    },
    applicantEmail: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    parentName: {
        type: String,
        required: [true, 'Parent/Guardian name is required'],
        trim: true
    },
    parentPhone: {
        type: String,
        required: [true, 'Parent/Guardian phone number is required']
    },
    parentEmail: {
        type: String,
        required: [true, 'Parent/Guardian email is required'],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    relationshipToApplicant: {
        type: String,
        enum: ['Parent', 'Guardian', 'Other'],
        required: [true, 'Relationship to applicant is required']
    },
    // Section D - Your Application
    applicationTrack: {
        type: String,
        enum: ['The Science Wiz', 'The Creative'],
        required: [true, 'Application track is required']
    },
    submissionType: {
        type: String,
        enum: ['Video', 'Link'],
        default: 'Video'
    },
    submissionUrl: {
        type: String,
        trim: true
    },
    submissionFile: {
        type: String,
        trim: true
    },
    tellUsAboutYourself: {
        type: String,
        required: [true, 'Please tell us about yourself'],
        maxlength: [150, 'Must be 150 words or less'],
        trim: true
    },
    // Section E - Discovery
    heardFrom: {
        type: String,
        required: [true, 'Please tell us how you heard about us']
    },
    otherSource: {
        type: String,
        trim: true
    },
    // Status
    status: {
        type: String,
        enum: ['pending', 'shortlisted', 'accepted', 'rejected'],
        default: 'pending'
    },
    adminNotes: {
        type: String,
        trim: true
    }
}, {
    timestamps: {
        createdAt: 'appliedAt',
        updatedAt: 'updatedAt'
    }
});
// Create indexes for searching
ApplicationSchema.index({
    firstName: 'text',
    lastName: 'text',
    parentEmail: 'text',
    applicantEmail: 'text',
    schoolName: 'text'
});
// Compound index for filtering
ApplicationSchema.index({ status: 1, applicationTrack: 1, appliedAt: -1 });
exports.default = mongoose_1.default.model('Application', ApplicationSchema);
