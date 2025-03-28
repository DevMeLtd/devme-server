import express from "express";
import uploadBlogImage from "../config/multer";
import { createBlogPost, deleteBlogPost, getAllBlogPosts, getBlogPostById } from "../controller/BlogController";


const blogRouter = express.Router();

blogRouter.post("/createblog", uploadBlogImage, createBlogPost);
blogRouter.get("/allblogs", getAllBlogPosts);
blogRouter.get("/oneblog/:id", getBlogPostById);
blogRouter.delete("/deleteblog/:id", deleteBlogPost)

export default blogRouter;