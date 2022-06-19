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
                    // Return JWT and get table
                    const JWTtoken = jwt.sign({ userID: userID, userPWD: userPWD }, process.env.JWTtoken, { expiresIn: "7 days" });
                    res.status(200).set("Authorization", JWTtoken).json({
                        userID: userID,
                        userPWD: userPWD,
                        userDataStatus: userDataStatus,
                    });
                }
                else if (rememberMe == "false") {
                    res.status(200).json({
                        userID: userID,
                        userPWD: userPWD,
                        userDataStatus: userDataStatus,
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
            const decoded = jwt.verify(token, process.env.JWTtoken);
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
                            userDataStatus = "true";
                            break;
                        case 2:
                            userDataStatus = "false";
                            break;
                        default:
                            userDataStatus = "failed";
                            break;
                    };

                    res.status(200).json({
                        userID: userID,
                        userPWD: userPWD,
                        userDataStatus: userDataStatus,
                    });
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
    const RequiredBody = ["ID", "PWD", "meetURL"];
    const hasAllRequiredBody = RequiredBody.every(item => Object.keys(req.body).includes(item));
    if (!hasAllRequiredBody || Object.keys(req.body).length < 3) {
        return res.status(400).send(`The following items are all required for this route : [${RequiredBody.join(", ")}]`);
    }
    else if (Object.keys(req.body).length > 3) {
        return res.status(400).send(`Only allowed ${RequiredBody.length} items in the body : [${RequiredBody.join(", ")}]`);
    };

    const userID = req.body.ID;
    const userPWD = req.body.PWD;
    const meetURL = req.body.meetURL;

    if (meetURL == "true") {
        const data = await slowTable(userID, userPWD);
        if (!data.error) {
            return res.status(200).json({ table: data });
        }
        else {
            return res.status(400).json(data.error);
        };
    }
    else if (meetURL == "false") {
        const data = await fastTable(userID, userPWD);
        if (!data.error) {
            return res.status(200).json({ table: data });
        }
        else {
            return res.status(400).json(data.error);
        };
    }
    else if (meetURL == "db") {
        const userDataResult = await readUserData(userID, userPWD);
        switch (userDataResult.code) {
            case 0:
                res.status(400).json("Failed to read user data.");
                break;
            case 1:
                res.status(200).json({ table: userDataResult.data });
                break;
            case 2:
                res.status(400).json("User data not found.");
                break;
        };
    }
    else {
        res.status(400).json(`meetURL must be boolean or "db".`);
    };
};

export const database = async (req, res) => {
    const RequiredBody = ["ID", "PWD"];
    const hasAllRequiredBody = RequiredBody.every(item => Object.keys(req.body).includes(item));
    if (!req.params.action) {
        return res.status(400).send("no param provided. [action] requires");
    }
    else if (!hasAllRequiredBody || Object.keys(req.body).length < 2) {
        return res.status(400).json(`The following items are all required for this route : [${RequiredBody.join(", ")}]`);
    }
    else if (Object.keys(req.body).length > 2) {
        return res.status(400).json(`Only allowed ${RequiredBody.length} items in the body : [${RequiredBody.join(", ")}]`);
    };

    const params = req.params;
    const userID = req.body.ID;
    const userPWD = req.body.PWD;

    switch (params.action) {
        case "save":
            const dataToSave = await slowTable(userID, userPWD);
            code = await saveUserData(userID, userPWD, dataToSave);
            switch (code) {
                case 0:
                    res.status(400).json("Failed to store user data.");
                    break;
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
                    res.status(400).json("Failed to read user data");
                    break;
                case 1:
                    res.status(200).json({ table: userDataResult.data });
                    break;
                case 2:
                    res.status(400).json("User data not found.");
                    break;
            };
            break;

        case "delete":
            const code = await deleteUserData(userID, userPWD);
            switch (code) {
                case 0:
                    res.status(400).json("Failed to delete user data.");
                    break;
                case 1:
                    res.status(200).json("Successfully deleted user data.");
                    break;
                case 2:
                    res.status(400).json("User data not found.");
                    break;
            };
            break;

        default:
            res.status(400).send("Wrong param. only allowed [\"save\", \"read\", \"delete\"]");
            break;
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