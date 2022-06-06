import login from '../function/login.js';
import fastTable from '../function/fastTable.js';
import slowTable from '../function/slowTable.js';
import saveUserData from '../function/MongoDB/saveUserData.js';
import readUserData from '../function/MongoDB/readUserData.js';
import deleteUserData from '../function/MongoDB/deleteUserData.js';
//import getIndex from '../function/getIndexpage.js';


export const none = (_, res) => {
    res.status(400).send('請傳入參數');
};

export const Login = async (req, res) => {
    const RequiredQuery = ["ID", "PWD"];
    const hasAllRequiredQuery = RequiredQuery.every(query => Object.keys(req.query).includes(query));
    if (!hasAllRequiredQuery) {
        return res.status(400).send(`The following query are all required for this route: ${RequiredQuery.join(", ")}`);
    }
    else if (req.query.ID == "" || req.query.PWD == "") {
        return res.status(400).send(`wrong query. [${RequiredQuery.join(", ")}] can't be empty.`);
    };

    const userID = req.query.ID;
    const userPWD = req.query.PWD;

    const result = await login(userID, userPWD);
    switch (result.status) {
        case 0:
            res.status(200).json(result.cookie);
            break;
        case 1:
            res.status(400).json("Login error : Wrong account");
            break;
        case 2:
            res.status(400).json("Login error : Wrong password");
            break;
    };
};

export const table = async (req, res) => {
    const RequiredQuery = ["ID", "PWD"];
    const hasAllRequiredQuery = RequiredQuery.every(query => Object.keys(req.query).includes(query));
    if (!hasAllRequiredQuery) {
        return res.status(400).send(`The following query are all required for this route: ${RequiredQuery.join(", ")}`);
    }
    else if (req.query.ID == "" || req.query.PWD == "") {
        return res.status(400).send(`wrong query. [${RequiredQuery.join(", ")}] can't be empty.`);
    };

    const userID = req.query.ID;
    const userPWD = req.query.PWD;

    if (req.query.meetURL == "true") {
        const data = await slowTable(userID, userPWD);
        if (!data.error) {
            res.status(200).json(data);
        }
        else {
            res.status(400).json(data.error);
        };
    }
    else {
        const data = await fastTable(userID, userPWD);
        if (!data.error) {
            res.status(200).json(data);
        }
        else {
            res.status(400).json(data.error);
        };
    };
};

export const database = async (req, res) => {
    const RequiredQuery = ["ID", "PWD"];
    const hasAllRequiredQuery = RequiredQuery.every(query => Object.keys(req.query).includes(query));
    if (!req.params) {
        return res.status(400).send("no param provided. [action] requires");
    }
    else if (!hasAllRequiredQuery) {
        return res.status(400).send(`The following query are all required for this route: [${RequiredQuery.join(", ")}]`);
    }
    else if (req.query.ID == "" || req.query.PWD == "") {
        return res.status(400).send(`wrong query. [${RequiredQuery.join(", ")}] can't be empty.`);
    };

    const params = req.params;
    const userID = req.query.ID;
    const userPWD = req.query.PWD;
    let result;
    let code;

    switch (params.action) {
        case "save":
            const dataToSave = await slowTable(userID, userPWD);
            code = await saveUserData(userID, userPWD, dataToSave);
            switch (code) {
                case 0:
                    res.status(400).json("failed to store user data");
                    break;
                case 1:
                    res.status(200).json("successfully stored user data");
                    break;
                case 2:
                    res.status(200).json("successfully updated user data");
                    break;
            };
            break;

        case "read":
            result = await readUserData(userID, userPWD);
            switch (result.code) {
                case 0:
                    res.status(400).json("failed to read user data");
                    break;
                case 1:
                    res.status(200).json(result.data);
                    break;
                case 2:
                    res.status(400).json("user data not found");
                    break;
            };
            break;

        case "delete":
            code = await deleteUserData(userID, userPWD);
            switch (code) {
                case 0:
                    res.status(400).json("failed to delete user data");
                    break;
                case 1:
                    res.status(200).json("successfully deleted user data");
                    break;
                case 2:
                    res.status(400).json("user data not found");
                    break;
            };
            break;

        default:
            res.status(400).send("wrong param. [\"save\", \"read\"] requires.");
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