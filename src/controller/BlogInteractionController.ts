import { Request, Response } from 'express';
import { blogModel } from '../model/BlogModel';
import { likeModel } from '../model/LikeModel';
import { commentModel } from '../model/CommentModel';

// Helper function to get user identifier (IP address)
const getUserIdentifier = (req: Request): string => {
    return req.ip || req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || 'unknown';
};

// Like a blog post
export const likeBlogPost = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userIdentifier = getUserIdentifier(req);

    try {
        // Check if user already liked this post
        const existingLike = await likeModel.findOne({ blogId: id, userIdentifier });
        
        if (existingLike) {
            res.status(400).json({ message: 'You already liked this post' });
            return;
        }

        // Create new like
        const newLike = new likeModel({
            blogId: id,
            userIdentifier
        });

        await newLike.save();

        // Update like count in blog post
        await blogModel.findByIdAndUpdate(id, { $inc: { likesCount: 1 } });

        const updatedBlog = await blogModel.findById(id);
        res.status(200).json(updatedBlog);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Unlike a blog post
export const unlikeBlogPost = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userIdentifier = getUserIdentifier(req);

    try {
        // Find and remove the like
        const deletedLike = await likeModel.findOneAndDelete({ blogId: id, userIdentifier });
        
        if (!deletedLike) {
            res.status(400).json({ message: 'You have not liked this post yet' });
            return;
        }

        // Update like count in blog post
        await blogModel.findByIdAndUpdate(id, { $inc: { likesCount: -1 } });

        const updatedBlog = await blogModel.findById(id);
        res.status(200).json(updatedBlog);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Add comment to blog post
export const addComment = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { username, content } = req.body;
    const userIdentifier = getUserIdentifier(req);

    if (!username || !content) {
        res.status(400).json({ message: 'Username and content are required' });
        return;
    }

    try {
        // Create new comment
        const newComment = new commentModel({
            blogId: id,
            userIdentifier,
            username,
            content
        });

        await newComment.save();

        // Update comment count in blog post
        await blogModel.findByIdAndUpdate(id, { $inc: { commentsCount: 1 } });

        res.status(201).json(newComment);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get all comments by a specific username
export const getCommentsByUsername = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;

    try {
        const comments = await commentModel.find({ username }).sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get all comments for a blog post
export const getComments = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const comments = await commentModel.find({ blogId: id }).sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Check if user has liked a blog post
export const checkUserLike = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userIdentifier = getUserIdentifier(req);

    try {
        const existingLike = await likeModel.findOne({ blogId: id, userIdentifier });
        res.status(200).json({ hasLiked: !!existingLike });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};