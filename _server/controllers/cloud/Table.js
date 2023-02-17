import jwt from "jsonwebtoken";
import MdTimetableAPI from "../../../_modules/MdTimetableAPI/index.js";


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
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(400).json("Please insert auth header");
    }

    const meetURL = req.query.meetURL;

    try {
        const token = authHeader.split(" ")[0];
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
        const ID = decoded.userID;
        const PWD = decoded.userPWD;

        switch (meetURL) {
            case "true": {
                const slowTableData = await APItimeout35.slowTable(ID, PWD);
                try {
                    return res.status(200).json({ year: slowTableData.year, table: slowTableData.table });
                } catch (error) {
                    return res.status(500).json(error.message.replace("slowTable : ", ""));
                }
            }
            case "false": {
                const fastTableData = await APItimeout25.fastTable(ID, PWD);
                try {
                    return res.status(200).json(fastTableData);
                } catch (error) {
                    return res.status(500).json(error.message.replace("fastTable : ", ""));
                }
            }
            default: {
                return res.status(400).send("meetURL must be boolean");
            }
        }
    }
    catch (error) {
        return res.status(403).json("Failed to verify, please login again");
    }
};