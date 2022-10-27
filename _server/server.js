import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./routers/cloud.js";
import cors_config from "./cors_config.json" assert { type: "json" };


const cloud = express();
cloud.use(cors(cors_config));
cloud.use(bodyParser.urlencoded({ extended: true }));
cloud.use(bodyParser.json());
cloud.use("/", router);

const app = express();
app.use("/", cloud);

export default app;