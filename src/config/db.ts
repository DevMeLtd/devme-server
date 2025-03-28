import mongoose from "mongoose";
import env from "dotenv";

env.config()

const uri = process.env.MONGOOSE_DB



if (!uri) {
    console.error("MONGOOSE_DB environment variable is nort defined");
    process.exit();
}

const dbConfig = async (): Promise<void> => {
    try {
        const connectDB = await mongoose.connect(uri);
        console.log(`connected to database on port ${connectDB.connection.host}`);
    } catch (error) {
        console.log(`failed to connect to database`, error)
    }
}

export default dbConfig;