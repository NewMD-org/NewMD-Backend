import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mdcloud from "./router/MdCloud.js";
// import API from "./router/API.js";


const cloud = express();
cloud.use(cors({
    exposedHeaders: "Authorization",
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://newmd.loca.lt",
        "https://newmd.netlify.app",
        "https://newmd.onrender.com"
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
// app.use(vhost("cloud." + host, cloud));
app.use("/cloud", cloud);
// app.use(vhost("api." + host, api));

export default app;
