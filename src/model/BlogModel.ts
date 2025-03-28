import mongoose from "mongoose";


interface blogs {
    devmeBlogImage: string | null,
    author: string,
    title: string;
    details: string;
    createdAt: Date;
}

interface iBlog extends blogs, mongoose.Document {};

const blogSchema = new mongoose.Schema({
    devmeBlogImage: {
        type: String,
        required: [true, "please, upload image"]
    },
    author : {
        type : String,
        required : [true, "please, input author"]
    },
    title : {
        type : String,
        required : [true, "please, input title"]
    },
    details : {
        type : String,
        required : [true, "please, input details"]
    },
    createdAt : {
        type : Date,
        default : Date.now,
    },
})

export const blogModel = mongoose.model<iBlog>("blog-devme", blogSchema)
  