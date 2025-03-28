"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("../config/multer"));
const BlogController_1 = require("../controller/BlogController");
const blogRouter = express_1.default.Router();
blogRouter.post("/createblog", multer_1.default, BlogController_1.createBlogPost);
blogRouter.get("/allblogs", BlogController_1.getAllBlogPosts);
blogRouter.get("/oneblog", BlogController_1.getBlogPostById);
blogRouter.delete("/deleteblog", BlogController_1.deleteBlogPost);
exports.default = blogRouter;
