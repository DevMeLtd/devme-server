import { Request, Response } from 'express';
import { blogModel } from '../model/BlogModel';
import cloudinary from '../config/cloudinary';
import { commentModel } from '../model/CommentModel';



// Upload blog image to Cloudinary and create new blog post
export const createBlogPost = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'blogs'  // Optional: Folder in Cloudinary where images will be stored
        });

        // Create new blog post with Cloudinary URL
        const newBlogPost = new blogModel({
            devmeBlogImage: result.secure_url,
            author: req.body.author,
            title: req.body.title,
            details: req.body.details
        });

        await newBlogPost.save();

        // Fetch all blog posts sorted by createdAt timestamp in descending order
        const allBlogPosts = await blogModel.find().sort({ createdAt: -1 });

        res.status(201).json(allBlogPosts);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


// In your getAllBlogPosts controller:
export const getAllBlogPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const blogPosts = await blogModel.find().sort({ createdAt: -1 });
        res.status(200).json(blogPosts);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// In your getBlogPostById controller, you might want to include comments:
export const getBlogPostById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const blogPost = await blogModel.findById(id);
        if (blogPost) {
            const comments = await commentModel.find({ blogId: id }).sort({ createdAt: -1 });
            res.status(200).json({ ...blogPost.toObject(), comments });
        } else {
            res.status(404).json({ message: 'Blog post not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


// Delete a blog post by ID
export const deleteBlogPost = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        // Find the blog post
        const blogPost = await blogModel.findById(id);
        if (!blogPost) {
            res.status(404).json({ message: "Blog post not found" });
            return;
        }

        // Check if blogImage exists
        if (blogPost.devmeBlogImage) {
            // Extract Cloudinary public ID from the image URL
            const imageUrl: string = blogPost.devmeBlogImage;
            const segments = imageUrl.split('/');
            const publicId = segments[segments.length - 1].split('.')[0]; // Extract public ID

            // Delete image from Cloudinary if publicId exists
            if (publicId) {
                await cloudinary.uploader.destroy(`blogs/${publicId}`);
            }
        }

        // Delete blog post from database
        await blogModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Blog post deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
