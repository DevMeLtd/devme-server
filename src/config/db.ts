import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGOOSE_DB;
console.log("Mongo-URI:", uri);

if (!uri) {
  console.error("❌ MONGOOSE_DB environment variable is not defined");
  process.exit(1);
}

const dbConfig = async (): Promise<void> => {
  try {
    // Optional: Log outbound IP address (helpful for MongoDB Atlas whitelist)
    const { data } = await axios.get('https://api.ipify.org?format=json');
    console.log("🌐 Render Public IP Address:", data.ip);

    const connectDB = await mongoose.connect(uri);
    console.log(`✅ Connected to MongoDB at ${connectDB.connection.host}`);
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
  }
};

export default dbConfig;
