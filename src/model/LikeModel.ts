import mongoose, { Schema } from 'mongoose';

const likeSchema = new Schema({
    blogId: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
    userIdentifier: { type: String, required: true }, // Can be IP address or browser fingerprint
    createdAt: { type: Date, default: Date.now }
});

export const likeModel = mongoose.model('Like', likeSchema);