import jwt from "jsonwebtoken";
import MdTimetableAPI from "../../../_modules/MdTimetableAPI/index.js";
import MongoDB from "../../../_modules/MongoDB/index.js";
import CheckRequestRequirement from "../../../_modules/CheckRequestRequirement/index.js";


const DB = new MongoDB();
const APItimeout15 = new MdTimetableAPI(15);

export const login = async (req, res) => {
    try {
        new CheckRequestRequirement(req, res).hasBody(["ID", "PWD", "rememberMe"]);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }

    if (req.body.ID == "") {
        return res.status(400).json({ message: "Missing Username" });
    }
    else if (req.body.PWD == "") {
        return res.status(400).json({ message: "Missing Password" });
    }

    const ID = req.body.ID;
    const PWD = req.body.PWD;
    const rememberMe = req.body.rememberMe;

    if (rememberMe !== "true" && rememberMe !== "false") {
        return res.status(400).json({ message: "RememberMe must be boolean" });
    }

    try {
        const JWTtoken = jwt.sign(
            {
                userID: ID,
                userPWD: PWD,
                rememberMe: rememberMe === "true"
            },
            process.env.JWT_SECRETKEY,
            { expiresIn: rememberMe === "true" ? "7 days" : "10 mins" }
        );

        try {
            await DB.read(ID, PWD);
            return res.status(200).set("Authorization", JWTtoken).json({
                userDataStatus: true
            });
        }
        catch (error) {
            const loginResult = await APItimeout15.login(ID, PWD);
            if (loginResult == 2) {
                return res.status(401).json({ message: "Incorrect account or password" });
            }
            else {
                return res.status(200).set("Authorization", JWTtoken).json({
                    message: loginResult ? "Success" : "MD server error",
                    userDataStatus: false
                });
            }
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};