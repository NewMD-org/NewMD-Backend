import getSchedule from '../function/memoryTable.js';
import { CGet } from '../lib/LRUCache.js';

export const onlyClassName = async (req, res) => {
    const params = req.params;
    const key = params.className;
    await CGet(key, () => {
        return getSchedule(params.className);
    }).then(data => {
        res.status(200).json(data);
    });
};

export const classNameWithYear = async (req, res) => {
    const params = req.params;
    const key = params.className + params.year;
    await CGet(key, () => {
        return getSchedule(params.className, params.year);
    }).then(data => {
        res.status(200).json(data);
    });
};

export const allParams = async (req, res) => {
    const params = req.params;
    const key = params.className + params.year + params.week;
    await CGet(key, () => {
        return getSchedule(params.className, Number(params.year), Number(params.week));
    }).then(data => {
        res.status(200).json(data);
    });
};