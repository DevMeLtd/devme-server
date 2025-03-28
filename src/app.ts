import express, { Application, Request, Response } from "express";
import cors from "cors";
import blogRouter from "./routes/BlogRouter";
import contactUsRouter from "./routes/ContactRouter";


const appConfig = (app: Application) => {
    app.use(express.json()).use(cors());


    // routes
    app.use("/blog", blogRouter);
    app.use("/mail", contactUsRouter)


    app.get("/", (req: Request, res: Response): any => {
        return res.status(200).json({
            message: "default get server"
        })
    })
}

export default appConfig;