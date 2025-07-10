import mongoose, { Document, Schema } from "mongoose"

export interface IAppointment extends Document {
    parentName: string;
    email: string;
    phone: string;
    childName: string;
    childAge: string;
    appointmentDate: Date;
    sessionType: 'counseling' | 'therapy';
    concerns: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: Date;
}

const AppointmentSchema: Schema = new Schema ({
    parentName: { type: String, required: true },
    email: { type: String, reqired: true },
    phone: { type: String, required: true},
    childName: {type: String, required: true},
    childAge: { type: String, require: true },
    appointmentDate: { type: Date, required: true },
    sessionType: { type: String, enum: ['counseling', 'therapy'], required: true },
    concerns: {type: String, required: true},
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default:'pending'},
    createdAt: { type: Date, default: Date.now}
})

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema)