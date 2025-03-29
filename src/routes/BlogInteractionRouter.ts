import express from 'express';
import {
    likeBlogPost,
    unlikeBlogPost,
    addComment,
    getComments,
    checkUserLike,
    getCommentsByUsername
} from '../controller/BlogInteractionController';

const commentRouter = express.Router();

// Like routes
commentRouter.post('/blogs/:id/like', likeBlogPost);
commentRouter.post('/blogs/:id/unlike', unlikeBlogPost);
commentRouter.get('/blogs/:id/check-like', checkUserLike);

// Comment routes
commentRouter.post('/blogs/:id/addcomments', addComment);
commentRouter.get('/blogs/:id/getcomments', getComments);

// comments by username
commentRouter.get("/comment/user/:username", getCommentsByUsername)

export default commentRouter;