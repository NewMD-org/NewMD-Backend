import jwt from "jsonwebtoken";
import MdTimetableAPI from "../../../_modules/MdTimetableAPI/index.js";
import MongoDB from "../../../_modules/MongoDB/index.js";


const DB = new MongoDB();
const APItimeout35 = new MdTimetableAPI(35);

export const database = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(400).json({ message: "Please insert auth header" });
    }

    const params = req.params;
    try {
        const token = authHeader.split(" ")[0];
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
        const ID = decoded.userID;
        const PWD = decoded.userPWD;

        try {
            switch (params.action) {
                case "save": {
                    const dataToSave = await APItimeout35.slowTable(ID, PWD);
                    const saveUserDataCode = await DB.save(ID, PWD, dataToSave);

                    if (saveUserDataCode === 0) {
                        return res.status(200).json({ message: "Successfully stored user data" });
                    }
                    else if (saveUserDataCode === 1) {
                        return res.status(200).json({ message: "Successfully updated user data" });
                    }
                    break;
                }
                case "read": {
                    const userDataResult = await DB.read(ID, PWD);

                    return res.status(200).json({
                        year: userDataResult["year"],
                        grade: userDataResult["grade"],
                        selectedWeek: userDataResult["selectedWeek"],
                        table: userDataResult["table"],
                        updatedAt: userDataResult["updatedAt"]
                    });
                }
                case "delete": {
                    const successfullyDelete = await DB.delete(ID, PWD);

                    if (successfullyDelete) {
                        return res.status(200).json({ message: "Successfully deleted user data" });
                    }
                    break;
                }
                default: {
                    throw new Error("Wrong param. only allowed [\"save\", \"read\", \"delete\"]");
                }
            }
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    catch (error) {
        return res.status(403).json({ message: "Failed to verify, please login again" });
    }
};