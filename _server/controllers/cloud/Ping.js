import { readFileSync } from "fs";

import ReadableTime from "../../../_modules/ReadableTime/index.js";
import CheckVersion from "../../../_modules/CheckVersion/index.js";


const packageJSON = JSON.parse(readFileSync("./package.json"));

export async function ping(req, res) {
    const latestVersion = await CheckVersion();

    res.status(200).json({
        "service": "up",
        "uptime": ReadableTime(Math.round(performance.now()))["string"],
        "version": {
            "current": packageJSON.version,
            "latest": latestVersion,
            "upToDate": latestVersion === packageJSON.version
        }
    });
}