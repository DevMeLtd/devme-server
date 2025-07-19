import express, { Application, Request, Response } from "express";
import cors from "cors";
import blogRouter from "./routes/BlogRouter";
import contactUsRouter from "./routes/ContactRouter";
import commentRouter from "./routes/BlogInteractionRouter";
import appointRouter from "./routes/appointmentRoutes";
import designRouter from "./routes/DesignRoutes";


const appConfig = (app: Application) => {
    app.use(express.json()).use(cors());


    // routes
    app.use("/blog", blogRouter);
    app.use("/mail", contactUsRouter)
    app.use("/action", commentRouter)
    app.use("/appoint", appointRouter)
    app.use("/design", designRouter)
    // app.use("/design", designRouter)


    app.get("/", (req: Request, res: Response): any => {
        return res.status(200).json({
            message: "default get server"
        })
    })
}

export default appConfig;