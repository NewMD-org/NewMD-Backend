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
    };

    const ID = req.body.ID;
    const PWD = req.body.PWD;
    const rememberMe = req.body.rememberMe;

    try {
        const loginResult = await APItimeout5.login(ID, PWD);
        const userDataResult = await DB.read(ID, PWD);

        let userDataStatus;
        switch (userDataResult.code) {
            case 0:
                userDataStatus = null;
                break;
            case 1:
                userDataStatus = true;
                break;
            case 2:
                userDataStatus = false;
                break;
            default:
                userDataStatus = null;
                break;
        };
        switch (loginResult.status) {
            case 0:
                if (rememberMe == "true") {
                    const JWTtoken = jwt.sign({ userID: ID, userPWD: PWD, rememberMe: "true" }, process.env.JWT_SECRETKEY, { expiresIn: "7 days" });
                    res.status(200).set("Authorization", JWTtoken).json({   
                        error: null,
                        userDataStatus
                    });
                }
                else if (rememberMe == "false") {
                    const JWTtoken = jwt.sign({ userID: ID, userPWD: PWD, rememberMe: "false" }, process.env.JWT_SECRETKEY, { expiresIn: "10 mins" });
                    res.status(200).set("Authorization", JWTtoken).json({
                        error: null,
                        userDataStatus,
                    });
                }
                else {
                    res.status(400).json("rememberMe must be boolean");
                };
                break;
            case 1:
                res.status(401).json("Incorrect account or password");
                break;
            case 2:
                res.status(401).json("Incorrect account or password");
                break;
            case 3:
                if (rememberMe == "true") {
                    const JWTtoken = jwt.sign({ userID: ID, userPWD: PWD, rememberMe: "true" }, process.env.JWT_SECRETKEY, { expiresIn: "7 days" });
                    res.status(200).set("Authorization", JWTtoken).json({
                        error: loginResult.error,
                        userDataStatus
                    });
                }
                else if (rememberMe == "false") {
                    const JWTtoken = jwt.sign({ userID: ID, userPWD: PWD, rememberMe: "false" }, process.env.JWT_SECRETKEY, { expiresIn: "10 mins" });
                    res.status(200).set("Authorization", JWTtoken).json({
                        error: loginResult.error,
                        userDataStatus,
                    });
                }
                else {
                    res.status(400).json("rememberMe must be boolean");
                };
                break;
        };
    } catch (error) {
        console.log(error);
        return res.status(500).json("Server error");
    };
};