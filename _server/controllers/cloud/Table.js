import jwt from "jsonwebtoken";
import MdTimetableAPI from "../../../_modules/MdTimetableAPI/index.js";
import MongoDB from "../../../_modules/MongoDB/index.js";


const DB = new MongoDB();
const APItimeout25 = new MdTimetableAPI(25);
const APItimeout35 = new MdTimetableAPI(35);

export const table = async (req, res) => {
    const RequiredQuery = ["meetURL"];
    const hasAllRequiredQuery = RequiredQuery.every(item => Object.keys(req.query).includes(item));
    if (!hasAllRequiredQuery || Object.keys(req.query).length < RequiredQuery.length) {
        return res.status(400).send(`The following items are all required for this route : [${RequiredQuery.join(", ")}]`);
    }
    else if (Object.keys(req.query).length > RequiredQuery.length) {
        return res.status(400).send(`Only allowed ${RequiredQuery.length} items in the body : [${RequiredQuery.join(", ")}]`);
    };

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(400).json(`Please insert auth header.`);
    };

    const meetURL = req.query.meetURL;

    try {
        const token = authHeader.split(" ")[0];
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
        const ID = decoded.userID;
        const PWD = decoded.userPWD;

        try {
            switch (meetURL) {
                case "true":
                    const slowTableData = await APItimeout35.slowTable(ID, PWD);
                    if (!slowTableData.error) {
                        return res.status(200).json({ year: slowTableData.year, table: slowTableData.table });
                    }
                    else {
                        throw new Error(slowTableData.error);
                    };
                case "false":
                    const fastTableData = await APItimeout25.fastTable(ID, PWD);
                    if (!fastTableData.error) {
                        return res.status(200).json({ year: fastTableData.year, table: fastTableData.table });
                    }
                    else {
                        throw new Error(fastTableData.error);
                    };
                case "db":
                    const userDataResult = await DB.read(ID, PWD);
                    switch (userDataResult.code) {
                        case 0:
                            throw new Error("Failed to read user data.");
                        case 1:
                            res.status(200).json({ year: userDataResult.year, table: userDataResult.table });
                            break;
                        case 2:
                            throw new Error("User data not found.");
                    };
                    break;
                default:
                    throw new Error(`meetURL must be boolean or "db".`);
            };
        }
        catch (error) {
            return res.status(500).json(error.message);
        };
    }
    catch (error) {
        return res.status(403).json("Failed to verify, please login again.");
    };
};