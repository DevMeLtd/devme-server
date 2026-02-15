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
    required: [true, 'Appointment date is required'],
    validate: {
      validator: function(this: IDiscoverySession, value: Date): boolean {
        return value > new Date();
      },
      message: 'Appointment date must be in the future'
    }
  },
  appointmentTime: {
    type: String,
    required: [true, 'Appointment time is required'],
    enum: {
      values: [
        "09:00 AM", "10:00 AM", "11:00 AM",
        "12:00 PM", "01:00 PM", "02:00 PM",
        "03:00 PM", "04:00 PM", "05:00 PM"
      ],
      message: 'Please select a valid time slot'
    }
  }
}, {
  timestamps: true
});

// Index for efficient querying
discoverySessionSchema.index({ email: 1 });
discoverySessionSchema.index({ appointmentDate: 1, appointmentTime: 1 });

const DiscoverySession = mongoose.model<IDiscoverySession>('DiscoverySession', discoverySessionSchema);

export default DiscoverySession;