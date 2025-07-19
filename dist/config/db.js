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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uri = process.env.MONGOOSE_DB;
console.log("Mongo-URI:", uri);
if (!uri) {
    console.error("❌ MONGOOSE_DB environment variable is not defined");
    process.exit(1);
}
const dbConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Optional: Log outbound IP address (helpful for MongoDB Atlas whitelist)
        const { data } = yield axios_1.default.get('https://api.ipify.org?format=json');
        console.log("🌐 Render Public IP Address:", data.ip);
        const connectDB = yield mongoose_1.default.connect(uri);
        console.log(`✅ Connected to MongoDB at ${connectDB.connection.host}`);
    }
    catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error);
    }
});
exports.default = dbConfig;
