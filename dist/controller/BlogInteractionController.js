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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserLike = exports.getComments = exports.getCommentsByUsername = exports.addComment = exports.unlikeBlogPost = exports.likeBlogPost = void 0;
const BlogModel_1 = require("../model/BlogModel");
const LikeModel_1 = require("../model/LikeModel");
const CommentModel_1 = require("../model/CommentModel");
// Helper function to get user identifier (IP address)
const getUserIdentifier = (req) => {
    var _a;
    return req.ip || ((_a = req.headers['x-forwarded-for']) === null || _a === void 0 ? void 0 : _a.toString()) || req.socket.remoteAddress || 'unknown';
};
// Like a blog post
const likeBlogPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userIdentifier = getUserIdentifier(req);
    try {
        // Check if user already liked this post
        const existingLike = yield LikeModel_1.likeModel.findOne({ blogId: id, userIdentifier });
        if (existingLike) {
            res.status(400).json({ message: 'You already liked this post' });
            return;
        }
        // Create new like
        const newLike = new LikeModel_1.likeModel({
            blogId: id,
            userIdentifier
        });
        yield newLike.save();
        // Update like count in blog post
        yield BlogModel_1.blogModel.findByIdAndUpdate(id, { $inc: { likesCount: 1 } });
        const updatedBlog = yield BlogModel_1.blogModel.findById(id);
        res.status(200).json(updatedBlog);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.likeBlogPost = likeBlogPost;
// Unlike a blog post
const unlikeBlogPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userIdentifier = getUserIdentifier(req);
    try {
        // Find and remove the like
        const deletedLike = yield LikeModel_1.likeModel.findOneAndDelete({ blogId: id, userIdentifier });
        if (!deletedLike) {
            res.status(400).json({ message: 'You have not liked this post yet' });
            return;
        }
        // Update like count in blog post
        yield BlogModel_1.blogModel.findByIdAndUpdate(id, { $inc: { likesCount: -1 } });
        const updatedBlog = yield BlogModel_1.blogModel.findById(id);
        res.status(200).json(updatedBlog);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.unlikeBlogPost = unlikeBlogPost;
// Add comment to blog post
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { username, content } = req.body;
    const userIdentifier = getUserIdentifier(req);
    if (!username || !content) {
        res.status(400).json({ message: 'Username and content are required' });
        return;
    }
    try {
        // Create new comment
        const newComment = new CommentModel_1.commentModel({
            blogId: id,
            userIdentifier,
            username,
            content
        });
        yield newComment.save();
        // Update comment count in blog post
        yield BlogModel_1.blogModel.findByIdAndUpdate(id, { $inc: { commentsCount: 1 } });
        res.status(201).json(newComment);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.addComment = addComment;
// Get all comments by a specific username
const getCommentsByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    try {
        const comments = yield CommentModel_1.commentModel.find({ username }).sort({ createdAt: -1 });
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getCommentsByUsername = getCommentsByUsername;
// Get all comments for a blog post
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const comments = yield CommentModel_1.commentModel.find({ blogId: id }).sort({ createdAt: -1 });
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getComments = getComments;
// Check if user has liked a blog post
const checkUserLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userIdentifier = getUserIdentifier(req);
    try {
        const existingLike = yield LikeModel_1.likeModel.findOne({ blogId: id, userIdentifier });
        res.status(200).json({ hasLiked: !!existingLike });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.checkUserLike = checkUserLike;
