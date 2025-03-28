import express, { Application } from "express";
import dbConfig from "./config/db";
import appConfig from "./app";


const app: Application = express();
appConfig(app);
dbConfig();


const port = 2025

app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})