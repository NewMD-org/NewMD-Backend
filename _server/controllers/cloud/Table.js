import jwt from "jsonwebtoken";
import CheckRequestRequirement from "../../../_modules/CheckRequestRequirement/index.js";
import MdTimetableAPI from "../../../_modules/MdTimetableAPI/index.js";


const APItimeout25 = new MdTimetableAPI(25);
const APItimeout35 = new MdTimetableAPI(35);

export const table = async (req, res) => {
    try {
        new CheckRequestRequirement(req, res).hasQuery(["meetURL"]);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(400).json({ message: "Please insert auth header" });
    }

    const meetURL = req.query.meetURL;

    try {
        const token = authHeader.split(" ")[0];
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
        const ID = decoded.userID;
        const PWD = decoded.userPWD;

        switch (meetURL) {
            case "true": {
                try {
                    const slowTableData = await APItimeout35.slowTable(ID, PWD);
                    return res.status(200).json(slowTableData);
                }
                catch (error) {
                    return res.status(500).json({ message: error.message.replace("slowTable : ", "") });
                }
            }
            case "false": {
                try {
                    const fastTableData = await APItimeout25.fastTable(ID, PWD);
                    return res.status(200).json(fastTableData);
                }
                catch (error) {
                    return res.status(500).json({ message: error.message.replace("fastTable : ", "") });
                }
            }
            default: {
                return res.status(400).json({ message: "meetURL must be boolean" });
            }
        }
    }
    catch (error) {
        return res.status(403).json({ message: "Failed to verify, please login again" });
    }
};