import multer from "multer";


const blogImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname)
    }
})


// to upload image
const uploadBlogImage = multer({
    storage: blogImageStorage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg|gif|PNG)$/)) {
            return cb(new Error("only images file are allowed!") as any, false)
        }
        cb(null, true)
    }
}).single("devmeBlogImage")

export default uploadBlogImage;