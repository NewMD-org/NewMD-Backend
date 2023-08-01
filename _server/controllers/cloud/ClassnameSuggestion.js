import jwt from "jsonwebtoken";
import MongoDB from "../../../_modules/MongoDB/index.js";
import MdTimetableAPI from "../../../_modules/MdTimetableAPI/index.js";
import ClassnameSuggestion from "../../../_modules/ClassnameSuggestion/index.js";


const DB = new MongoDB();
const APItimeout15 = new MdTimetableAPI(15);

export const classnamesuggestion = async (req, res) => {
    const RequiredBody = ["original", "replacement"];
    const hasAllRequiredBody = RequiredBody.every(item => Object.keys(req.body).includes(item));
    if (!hasAllRequiredBody || Object.keys(req.body).length < RequiredBody.length) {
        return res.status(400).json(`The following items are all required for this route : [${RequiredBody.join(", ")}]`);
    }
    else if (Object.keys(req.body).length > RequiredBody.length) {
        return res.status(400).json(`Only allowed ${RequiredBody.length} items in the body : [${RequiredBody.join(", ")}]`);
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(400).json("Please insert auth header");
    }

    const original = req.body.original;
    const replacement = req.body.replacement;

    try {
        const token = authHeader.split(" ")[0];
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
        const ID = decoded.userID;
        const PWD = decoded.userPWD;

        try {
            await DB.read(ID, PWD);
        } catch (error) {
            const loginResult = await APItimeout15.login(ID, PWD);
            if (loginResult == 2) {
                return res.status(403).json("Failed to verify, please login again");
            }
        }

        const { status, url } = await ClassnameSuggestion(original, replacement);
        if (status === 2) {
            return res.status(400).json({ message: "Invalid input" });
        }
        else if (status === 1) {
            return res.status(200).json({ issueURL: url });
        }
        else {
            return res.status(502).json({ message: "Unexpected error" });
        }
    }
    catch (error) {
        return res.status(403).json("Failed to verify, please login again");
    }
};