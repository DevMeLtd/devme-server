"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const BlogRouter_1 = __importDefault(require("./routes/BlogRouter"));
const ContactRouter_1 = __importDefault(require("./routes/ContactRouter"));
const BlogInteractionRouter_1 = __importDefault(require("./routes/BlogInteractionRouter"));
const appointmentRoutes_1 = __importDefault(require("./routes/appointmentRoutes"));
const DesignRoutes_1 = __importDefault(require("./routes/DesignRoutes"));
const DiscoverySessionRoutes_1 = __importDefault(require("./routes/DiscoverySessionRoutes"));
const appConfig = (app) => {
    app.use(express_1.default.json()).use((0, cors_1.default)());
    // routes
    app.use("/blog", BlogRouter_1.default);
    app.use("/mail", ContactRouter_1.default);
    app.use("/action", BlogInteractionRouter_1.default);
    app.use("/appoint", appointmentRoutes_1.default);
    app.use("/design", DesignRoutes_1.default);
    // app.use("/design", designRouter)
    app.use("/discovery", DiscoverySessionRoutes_1.default);
    app.get("/", (req, res) => {
        return res.status(200).json({
            message: "default get server"
        });
    });
};
exports.default = appConfig;
