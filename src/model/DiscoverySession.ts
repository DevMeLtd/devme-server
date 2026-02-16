import mongoose, { Document, Schema } from 'mongoose';

export interface IDiscoverySession extends Document {
  name: string;
  email: string;
  phone: string;
  appointmentDate: Date;
  appointmentTime: string;
  createdAt: Date;
  updatedAt: Date;
}

const discoverySessionSchema = new Schema<IDiscoverySession>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [
      /^[\d\s\+\-\(\)]{10,}$/,
      'Please provide a valid phone number'
    ]
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  appointmentTime: {
    type: String,
    required: [true, 'Appointment time is required']
  }
}, {
  timestamps: true
});

// Index for efficient querying
discoverySessionSchema.index({ email: 1 });
discoverySessionSchema.index({ createdAt: -1 });

const DiscoverySession = mongoose.model<IDiscoverySession>('DiscoverySession', discoverySessionSchema);

export default DiscoverySession;