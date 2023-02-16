import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";
import { rateLimit } from "express-rate-limit";

import router from "./routers/cloud.js";


const defaultCors = {
    "exposedHeaders": "Authorization",
    "origin": [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://newmd.eu.org"
    ]
};

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later!"
});

const cloud = express();
cloud.use(cors(await getCorsConfig()));
cloud.use(bodyParser.urlencoded({ extended: true }));
cloud.use(bodyParser.json());
cloud.use("/", router);

const app = express();
app.set("trust proxy", 1);
app.use(limiter);
app.use("/", cloud);

export default app;


async function getCorsConfig() {
    const t0 = performance.now();

    var cors = defaultCors;

    try {
        const response = await axios.get("https://raw.githubusercontent.com/NewMD-org/Configurations/main/Backend/cors.json");
        cors = response.data || defaultCors;

        const t1 = performance.now();
        console.log(`Server : successfully got cors config from remote source (took ${Math.round(t1 - t0) / 1000} seconds)`);
    }
    catch (err) {
        console.error("Server : cannot get cors config from remote source, using default cors config");
    }

    return cors;
}