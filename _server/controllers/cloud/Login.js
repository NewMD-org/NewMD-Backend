import jwt from "jsonwebtoken";
import MdTimetableAPI from "../../../_modules/MdTimetableAPI/index.js";
import MongoDB from "../../../_modules/MongoDB/index.js";


const DB = new MongoDB();
const APItimeout5 = new MdTimetableAPI(5);

export const login = async (req, res) => {
    const RequiredBody = ["ID", "PWD", "rememberMe"];
    const hasAllRequiredBody = RequiredBody.every(item => Object.keys(req.body).includes(item));
    if (!hasAllRequiredBody || Object.keys(req.body).length < RequiredBody.length) {
        return res.status(400).json(`The following items are all required for this route : [${RequiredBody.join(", ")}]`);
    }
    else if (Object.keys(req.body).length > RequiredBody.length) {
        return res.status(400).json(`Only allowed ${RequiredBody.length} items in the body : [${RequiredBody.join(", ")}]`);
    }
    else if (req.body.ID == "") {
        return res.status(400).json("Missing Username");
    }
    else if (req.body.PWD == "") {
        return res.status(400).json("Missing Password");
    }

    const ID = req.body.ID;
    const PWD = req.body.PWD;
    const rememberMe = req.body.rememberMe;

    if (rememberMe !== "true" && rememberMe !== "false") {
        return res.status(400).json({ message: "RememberMe must be boolean" });
    }

    try {
        let userDataStatus = false;
        try {
            await DB.read(ID, PWD);
            userDataStatus = true;
        } catch (error) {
            userDataStatus = false;
        }

        const loginResult = await APItimeout5.login(ID, PWD);
        switch (loginResult.status) {
            case 0: {
                if (rememberMe == "true") {
                    const JWTtoken = jwt.sign({ userID: ID, userPWD: PWD, rememberMe: "true" }, process.env.JWT_SECRETKEY, { expiresIn: "7 days" });
                    return res.status(200).set("Authorization", JWTtoken).json({
                        userDataStatus
                    });
                }
                else if (rememberMe == "false") {
                    const JWTtoken = jwt.sign({ userID: ID, userPWD: PWD, rememberMe: "false" }, process.env.JWT_SECRETKEY, { expiresIn: "10 mins" });
                    return res.status(200).set("Authorization", JWTtoken).json({
                        userDataStatus
                    });
                }
                break;
            }
            case 1:
            case 2: {
                return res.status(401).json({ message: "Incorrect account or password" });
            }
            case 3: {
                if (rememberMe == "true") {
                    const JWTtoken = jwt.sign({ userID: ID, userPWD: PWD, rememberMe: "true" }, process.env.JWT_SECRETKEY, { expiresIn: "7 days" });
                    return res.status(200).set("Authorization", JWTtoken).json({
                        message: loginResult.message,
                        userDataStatus
                    });
                }
                else if (rememberMe == "false") {
                    const JWTtoken = jwt.sign({ userID: ID, userPWD: PWD, rememberMe: "false" }, process.env.JWT_SECRETKEY, { expiresIn: "10 mins" });
                    return res.status(200).set("Authorization", JWTtoken).json({
                        message: loginResult.message,
                        userDataStatus
                    });
                }
                break;
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json("Server error");
    }
};