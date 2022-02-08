import login from '../function/login.js';
import getIndex from '../function/getIndexpage.js';
import fastTable from '../function/fastTable.js';
import { CGet } from '../lib/LRUCache.js';

export const None = (_, res) => {
    res.send('請傳入參數');
};

export const Login = (req, res) => {
    let params = req.params;
    login(params.id, params.psd)
        .then(data => {
            if (!data.error) {
                res.status(200).json({
                    status: data.status,
                    cookie: data.cookie
                });
            } else {
                res.status(404).json(data);
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
                res.status(404).json(data);
            };
        });
};

export const FastTable = async (req, res) => {
    const params = req.params;
    const key = params.id + params.pwd;
    await CGet(key, () => {
        return fastTable(params.id, params.pwd);
    }).then(data => {
        res.status(200).json(data);
    });
};