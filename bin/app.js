import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mdcloud from "../router/MdCloud.js";
// import API from "./router/API.js";


const cloud = express();
cloud.use(cors({
    exposedHeaders: "Authorization",
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://test.haco.tw",
        "https://k1d1.haco.tw",
        "https://test.aaaaoncloud.eu.org",
        "https://newmd.aaaaoncloud.eu.org",
        "https://newmd.eu.org",
        "https://newmd.netlify.app"
    ]
}));
cloud.use(bodyParser.urlencoded({ extended: true }));
cloud.use(bodyParser.json());
cloud.use("/", mdcloud);

// const api = express();
// api.use(cors());
// api.use(bodyParser.urlencoded({ extended: true }));
// api.use(bodyParser.json());
// api.use("/", API);

const app = express();
app.use("/", cloud);

export default app;