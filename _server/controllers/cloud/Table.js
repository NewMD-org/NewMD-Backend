import jwt from "jsonwebtoken";
import MdTimetableAPI from "../../../_modules/MdTimetableAPI/index.js";
import MongoDB from "../../../_modules/MongoDB/index.js";


const DB = new MongoDB();
const APItimeout25 = new MdTimetableAPI(25);
const APItimeout35 = new MdTimetableAPI(35);
//     const RequiredBody = ["ID", "PWD", "rememberMe"];
//     const hasAllRequiredBody = RequiredBody.every(item => Object.keys(req.body).includes(item));
//     if (!hasAllRequiredBody || Object.keys(req.body).length < 3) {
//         return res.status(400).json(`The following items are all required for this route : [${RequiredBody.join(", ")}]`);
//     }
//     else if (Object.keys(req.body).length > 3) {
//         return res.status(400).json(`Only allowed ${RequiredBody.length} items in the body : [${RequiredBody.join(", ")}]`);
//     }
//     else if (req.body.ID == "") {
//         return res.status(400).json("Missing Username.");
//     }
//     else if (req.body.PWD == "") {
//         return res.status(400).json("Missing Password.");
//     };

//     const ID = req.body.ID;
//     const PWD = req.body.PWD;
//     const rememberMe = req.body.rememberMe;

//     try {
//         const loginResult = await APItimeout5.login(ID, PWD);
//         const userDataResult = await DataBase.read(ID, PWD);

//         let userDataStatus;
//         switch (userDataResult.code) {
//             case 0:
//                 userDataStatus = null;
//                 break;
//             case 1:
//                 userDataStatus = true;
//                 break;
//             case 2:
//                 userDataStatus = false;
//                 break;
//             default:
//                 userDataStatus = null;
//                 break;
//         };
//         switch (loginResult.status) {
//             case 0:
//                 if (rememberMe == "true") {
//                     const JWTtoken = jwt.sign({ userID: ID, userPWD: PWD, rememberMe: "true" }, process.env.JWT_SECRETKEY, { expiresIn: "7 days" });
//                     res.status(200).set("Authorization", JWTtoken).json({   
//                         error: null,
//                         userDataStatus
//                     });
//                 }
//                 else if (rememberMe == "false") {
//                     const JWTtoken = jwt.sign({ userID: ID, userPWD: PWD, rememberMe: "false" }, process.env.JWT_SECRETKEY, { expiresIn: "10 mins" });
//                     res.status(200).set("Authorization", JWTtoken).json({
//                         error: null,
//                         userDataStatus,
//                     });
//                 }
//                 else {
//                     res.status(400).json("rememberMe must be boolean.");
//                 };
//                 break;
//             case 1:
//                 res.status(401).json("Incorrect account or password.");
//                 break;
//             case 2:
//                 res.status(401).json("Incorrect account or password.");
//                 break;
//             case 3:
//                 if (rememberMe == "true") {
//                     const JWTtoken = jwt.sign({ userID: ID, userPWD: PWD, rememberMe: "true" }, process.env.JWT_SECRETKEY, { expiresIn: "7 days" });
//                     res.status(200).set("Authorization", JWTtoken).json({
//                         error: loginResult.error,
//                         userDataStatus
//                     });
//                 }
//                 else if (rememberMe == "false") {
//                     const JWTtoken = jwt.sign({ userID: ID, userPWD: PWD, rememberMe: "false" }, process.env.JWT_SECRETKEY, { expiresIn: "10 mins" });
//                     res.status(200).set("Authorization", JWTtoken).json({
//                         error: loginResult.error,
//                         userDataStatus,
//                     });
//                 }
//                 else {
//                     res.status(400).json("rememberMe must be boolean.");
//                 };
//                 break;
//         };
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json("Server error.");
//     };
// };

export default table = async (req, res) => {
    const RequiredQuery = ["meetURL"];
    const hasAllRequiredQuery = RequiredQuery.every(item => Object.keys(req.query).includes(item));
    if (!hasAllRequiredQuery || Object.keys(req.query).length < RequiredQuery.length) {
        return res.status(400).send(`The following items are all required for this route : [${RequiredQuery.join(", ")}]`);
    }
    else if (Object.keys(req.query).length > 3) {
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
                        return res.status(200).json({ table: slowTableData });
                    }
                    else {
                        throw new Error(slowTableData.error);
                    };
                case "false":
                    const fastTableData = await APItimeout25.fastTable(ID, PWD);
                    if (!fastTableData.error) {
                        return res.status(200).json({ table: fastTableData });
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
                            res.status(200).json({ table: userDataResult.data });
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