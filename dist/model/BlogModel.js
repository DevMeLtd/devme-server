"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
;
const blogSchema = new mongoose_1.default.Schema({
    devmeBlogImage: {
        type: String,
        required: [true, "please, upload image"]
    },
    author: {
        type: String,
        required: [true, "please, input author"]
    },
    title: {
        type: String,
        required: [true, "please, input title"]
    },
    details: {
        type: String,
        required: [true, "please, input details"]
    },
    likesCount: {
        type: Number,
        default: 0
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.blogModel = mongoose_1.default.model("blog-devme", blogSchema);
