import getSchedule from '../function/memoryTable.js';
import fastTable from '../function/fastTable.js';

export const onlyClassName = async (req, res) => {
    const params = req.params;
    const data = await getSchedule(params.className);
    if (!data.error) {
        res.status(200).json(data);
    }
    else {
        res.status(400).json(data.error);
    };
};

export const twoParams = async (req, res) => {
    const params = req.params;
    if (params.a.length > 5) {
        const data = await fastTable(params.a, params.b);
        if (!data.error) {
            res.status(200).json(data);
        }
        else {
            res.status(400).json(data.error);
        };
    }
    else {
        const data = await getSchedule(params.a, params.b);
        if (!data.error) {
            res.status(200).json(data);
        }
        else {
            res.status(400).json(data.error);
        };
    };
};

export const allParams = async (req, res) => {
    const params = req.params;
    const data = getSchedule(params.className, Number(params.year), Number(params.week));
    if (!data.error) {
        res.status(200).json(data);
    }
    else {
        res.status(400).json(data.error);
    };
};