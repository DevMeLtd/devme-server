import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema({
    blogId: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
    userIdentifier: { type: String, required: true }, // IP or fingerprint for basic tracking
    username: { type: String, required: true }, // User-provided username
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export const commentModel = mongoose.model('Comment', commentSchema);