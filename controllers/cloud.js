import jwt from 'jsonwebtoken';
import axios from 'axios';
import testLogin from '../function/testLogin.js';
import fastTable from '../function/fastTable.js';
import slowTable from '../function/slowTable.js';
import saveUserData from '../function/MongoDB/saveUserData.js';
import readUserData from '../function/MongoDB/readUserData.js';
import deleteUserData from '../function/MongoDB/deleteUserData.js';
//import getIndex from '../function/getIndexpage.js';


export const none = (_, res) => {
    res.status(400).send('請傳入參數');
};

export const login = async (req, res) => {
    const RequiredBody = ["ID", "PWD", "rememberMe"];
    const hasAllRequiredBody = RequiredBody.every(item => Object.keys(req.body).includes(item));
    if (!hasAllRequiredBody || Object.keys(req.body).length < 3) {
        return res.status(400).json(`The following items are all required for this route : [${RequiredBody.join(", ")}]`);
    }
    else if (Object.keys(req.body).length > 3) {
        return res.status(400).json(`Only allowed ${RequiredBody.length} items in the body : [${RequiredBody.join(", ")}]`);
    };

    const authHeader = req.headers.authorization;
    const rememberMe = req.body.rememberMe;

    if (!authHeader && (req.body.ID == "" && req.body.PWD == "")) {
        return res.status(400).json(`Please insert following item's value : [${RequiredBody.join(", ")}]`);
    }
    else if (req.body.ID != "" && req.body.PWD != "") {
        const userID = req.body.ID;
        const userPWD = req.body.PWD;

        const loginResult = await testLogin(userID, userPWD);
        switch (loginResult.status) {
            case 0:
                const userDataResult = await readUserData(userID, userPWD);
                let userDataStatus;
                switch (userDataResult.code) {
                    case 0:
                        userDataStatus = "failed";
                        break;
                    case 1:
                        userDataStatus = "found";
                        break;
                    case 2:
                        userDataStatus = "not found";
                        break;
                    default:
                        userDataStatus = "failed";
                        break;
                };

                if (rememberMe == "true") {
                    const JWTtoken = jwt.sign({ userID: userID, userPWD: userPWD }, process.env.JWT_SECRETKEY, { expiresIn: "7 days" });
                    res.status(200).set("Authorization", JWTtoken).json({
                        old: true,
                        userDataStatus
                    });
                }
                else if (rememberMe == "false") {
                    const JWTtoken = jwt.sign({ userID: userID, userPWD: userPWD }, process.env.JWT_SECRETKEY, { expiresIn: "10 mins" });
                    res.status(200).set("Authorization", JWTtoken).json({
                        old: true,
                        userDataStatus,
                    });
                }
                else {
                    res.status(400).json("rememberMe must be boolean.");
                };
                break;
            case 1:
                res.status(400).json("Wrong account.");
                break;
            case 2:
                res.status(400).json("Wrong password.");
                break;
        };
    }
    else if (authHeader && (req.body.ID == "" && req.body.PWD == "")) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
            const userID = decoded.userID;
            const userPWD = decoded.userPWD;

            const result = await testLogin(userID, userPWD);
            switch (result.status) {
                case 0:
                    const userDataResult = await readUserData(userID, userPWD);
                    let userDataStatus;
                    switch (userDataResult.code) {
                        case 0:
                            userDataStatus = "failed";
                            break;
                        case 1:
                            userDataStatus = "found";
                            break;
                        case 2:
                            userDataStatus = "not found";
                            break;
                        default:
                            userDataStatus = "failed";
                            break;
                    };

                    if (rememberMe == "true") {
                        const JWTtoken = jwt.sign({ userID: userID, userPWD: userPWD }, process.env.JWT_SECRETKEY, { expiresIn: "7 days" });
                        res.status(200).set("Authorization", JWTtoken).json({
                            old: false,
                            userDataStatus,
                        });
                    }
                    else if (rememberMe == "false") {
                        const JWTtoken = jwt.sign({ userID: userID, userPWD: userPWD }, process.env.JWT_SECRETKEY, { expiresIn: "10 mins" });
                        res.status(200).set("Authorization", JWTtoken).json({
                            old: false,
                            userDataStatus,
                        });
                    }
                    else {
                        res.status(400).json("rememberMe must be boolean.");
                    };
                    break;
                case 1:
                    res.status(400).json("Wrong account.");
                    break;
                case 2:
                    res.status(400).json("Wrong password.");
                    break;
            };
        }
        catch (error) {
            return res.status(403).json("Failed to verify, please login again.");
        };
    };
};

export const table = async (req, res) => {
    const query = req.query;

    const RequiredQuery = ["meetURL"];
    const hasAllRequiredQuery = RequiredQuery.every(item => Object.keys(query).includes(item));
    if (!hasAllRequiredQuery || Object.keys(query).length < RequiredQuery.length) {
        return res.status(400).send(`The following items are all required for this route : [${RequiredQuery.join(", ")}]`);
    }
    else if (Object.keys(query).length > 3) {
        return res.status(400).send(`Only allowed ${RequiredQuery.length} items in the body : [${RequiredQuery.join(", ")}]`);
    };

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(400).json(`Please insert auth header.`);
    };

    const meetURL = query.meetURL;
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);

        const userID = decoded.userID;
        const userPWD = decoded.userPWD;
        try {
            switch (meetURL) {
                case "true":
                    const slowTableData = await slowTable(userID, userPWD);
                    if (!slowTableData.error) {
                        return res.status(200).json({ table: slowTableData });
                    }
                    else {
                        throw new Error(slowTableData.error);
                    };
                case "false":
                    const fastTableData = await fastTable(userID, userPWD);
                    if (!fastTableData.error) {
                        return res.status(200).json({ table: fastTableData });
                    }
                    else {
                        throw new Error(fastTableData.error);
                    };
                case "db":
                    const userDataResult = await readUserData(userID, userPWD);
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
            return res.status(400).json(error.message);
        };
    }
    catch (error) {
        return res.status(403).json("Failed to verify, please login again.");
    };
};

export const database = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(400).json(`Please insert auth header.`);
    };

    const params = req.params;
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);

        const userID = decoded.userID;
        const userPWD = decoded.userPWD;
        try {
            switch (params.action) {
                case "save":
                    const dataToSave = await slowTable(userID, userPWD);
                    const saveUserDataCode = await saveUserData(userID, userPWD, dataToSave);
                    switch (saveUserDataCode) {
                        case 0:
                            throw new Error("Failed to store user data.");
                        case 1:
                            res.status(200).json("Successfully stored user data.");
                            break;
                        case 2:
                            res.status(200).json("Successfully updated user data.");
                            break;
                    };
                    break;
                case "read":
                    const userDataResult = await readUserData(userID, userPWD);
                    switch (userDataResult.code) {
                        case 0:
                            throw new Error("Failed to read user data");
                        case 1:
                            res.status(200).json({ table: userDataResult.data });
                            break;
                        case 2:
                            throw new Error("User data not found.");
                    };
                    break;
                case "delete":
                    const code = await deleteUserData(userID, userPWD);
                    switch (code) {
                        case 0:
                            throw new Error("Failed to delete user data.");
                        case 1:
                            res.status(200).json("Successfully deleted user data.");
                            break;
                        case 2:
                            throw new Error("User data not found.");
                    };
                    break;
                default:
                    throw new Error("Wrong param. only allowed [\"save\", \"read\", \"delete\"]");
            };
        }
        catch (error) {
            return res.status(400).json(error.message);
        };
    }
    catch (error) {
        return res.status(403).json("Failed to verify, please login again.");
    };
};

/* PAUSED */
// export const StdData = async (req, res) => {
//     const params = req.params;
//     getIndex(params.cookie)
//         .then(data => {
//             if (!data.error) {
//                 res.status(200).json(data);
//             }
//             else {
//                 res.status(400).json(data);
//             };
//         });
// };