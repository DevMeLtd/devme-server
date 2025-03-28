
import mongoose, { Schema } from "mongoose";

export interface iContactUs extends Document {
    name: string;
    email: string;
    content: string;
}

const contactSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    }
})

const contactUsModel = mongoose.model<iContactUs>("devme-contact", contactSchema);

export default contactUsModel;