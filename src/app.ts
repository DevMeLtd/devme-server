import express, { Application, Request, Response } from "express";
import cors from "cors";
import blogRouter from "./routes/BlogRouter";
import contactUsRouter from "./routes/ContactRouter";
import commentRouter from "./routes/BlogInteractionRouter";
import appointRouter from "./routes/appointmentRoutes";
import designRouter from "./routes/DesignRoutes";
import discoveryRouter from "./routes/DiscoverySessionRoutes";
import adminRouter from "./routes/adminRoutes";
import futureRouter from "./routes/applicationRoutes";


const appConfig = (app: Application) => {
    app.use(express.json()).use(cors());


    // routes
    app.use("/blog", blogRouter);
    app.use("/mail", contactUsRouter)
    app.use("/action", commentRouter)
    app.use("/appoint", appointRouter)
    app.use("/design", designRouter)
    // app.use("/design", designRouter)
    app.use("/discovery", discoveryRouter)

    app.use("/admin", adminRouter)
    app.use("/future", futureRouter)


    app.get("/", (req: Request, res: Response): any => {
        return res.status(200).json({
            message: "default get server"
        })
    })
}

export default appConfig;