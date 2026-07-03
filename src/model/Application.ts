import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  // Section A - About You
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female';
  stateOfOrigin: string;
  
  // Section B - Your School
  schoolName: string;
  schoolType: 'Public' | 'Private';
  currentClass: string;
  
  // Section C - Contact Details
  applicantPhone: string;
  applicantEmail?: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  relationshipToApplicant: 'Parent' | 'Guardian' | 'Other';
  
  // Section D - Your Application
  applicationTrack: 'The Science Wiz' | 'The Creative';
  submissionType: 'Video' | 'Link';
  submissionUrl?: string;
  submissionFile?: string;
  tellUsAboutYourself: string;
  
  // Section E - Discovery
  heardFrom: string;
  otherSource?: string;
  
  // Status
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected';
  adminNotes?: string;
  appliedAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>({
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

export default mongoose.model<IApplication>('Application', ApplicationSchema);