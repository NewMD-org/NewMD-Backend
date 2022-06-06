import login from '../function/login.js';
import getIndex from '../function/getIndexpage.js';
import fastTable from '../function/fastTable.js';
import slowTable from '../function/slowTable.js';
import storeUserData from '../function/MongoDB/storeUserData.js';
import readUserData from '../function/readUserData.js';


export const None = (_, res) => {
    res.send('請傳入參數');
};

export const Login = (req, res) => {
    let params = req.params;
    login(params.id, params.psd)
        .then(data => {
            if (data.error) {
                res.status(400).json(data);
            } else {
                res.status(200).json(data);
            }
        })
};

export const StdData = (req, res) => {
    const params = req.params;
    getIndex(params.cookie)
        .then(data => {
            if (!data.error) {
                res.status(200).json(data);
            }
            else {
                res.status(400).json(data);
            };
        });
};

export const table = async (req, res) => {
    const params = req.params;
    const query = req.query;
    if (query.meetURL == "true") {
        const data = await slowTable(params.id, params.pwd);
        if (!data.error) {
            res.status(200).json(data);
        }
        else {
            res.status(400).json(data.error);
        };
    }
    else {
        const data = await fastTable(params.id, params.pwd);
        if (!data.error) {
            res.status(200).json(data);
        }
        else {
            res.status(400).json(data.error);
        };
    };
};

export const database = async (req, res) => {
    const params = req.params;
    switch (params.action) {
        case "save":
            const dataToSave = await slowTable(params.id, params.pwd);
            const code = await storeUserData(params.id, params.pwd, dataToSave);
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
            const result = await readUserData(params.id, params.pwd);
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
    };
};