import jwt from "jsonwebtoken";
import MdTimetableAPI from "../../../_modules/MdTimetableAPI/index.js";
import MongoDB from "../../../_modules/MongoDB/index.js";


const DB = new MongoDB();
const APItimeout35 = new MdTimetableAPI(35);

export const database = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(400).json(`Please insert auth header`);
    };

    const params = req.params;
    try {
        const token = authHeader.split(" ")[0];
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
        const ID = decoded.userID;
        const PWD = decoded.userPWD;

        try {
            switch (params.action) {
                case "save":
                    const dataToSave = await APItimeout35.slowTable(ID, PWD);
                    if (!dataToSave.error) {
                        const saveUserDataCode = await DB.save(ID, PWD, dataToSave);
                        switch (saveUserDataCode) {
                            case 0:
                                throw new Error("Failed to store user data");
                            case 1:
                                res.status(200).json("Successfully stored user data");
                                break;
                            case 2:
                                res.status(200).json("Successfully updated user data");
                                break;
                        };
                    }
                    else {
                        throw new Error("Failed to store user data");
                    };
                    break;
                case "read":
                    const userDataResult = await DB.read(ID, PWD);
                    switch (userDataResult.code) {
                        case 0:
                            throw new Error("Failed to read user data");
                        case 1:
                            res.status(200).json({ year: userDataResult.year, table: userDataResult.table, updatedAt: userDataResult.updatedAt });
                            break;
                        case 2:
                            throw new Error("User data not found");
                    };
                    break;
                case "delete":
                    const code = await DB.delete(ID, PWD);
                    switch (code) {
                        case 0:
                            throw new Error("Failed to delete user data");
                        case 1:
                            res.status(200).json("Successfully deleted user data");
                            break;
                        case 2:
                            throw new Error("User data not found");
                    };
                    break;
                default:
                    throw new Error("Wrong param. only allowed [\"save\", \"read\", \"delete\"]");
            };
        }
        catch (error) {
            return res.status(500).json(error.message);
        };
    }
    catch (error) {
        return res.status(403).json("Failed to verify, please login again");
    };
};