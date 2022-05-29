import getSchedule from '../function/memoryTable.js';

export const onlyClassName = async (req, res) => {
    const params = req.params;
    const key = params.className;
    const data = await getSchedule(params.className);
    if( data.error ) {
        res.status(400).json(data);
    }else {
        res.status(200).json(data);
    }
};

export const classNameWithYear = async (req, res) => {
    const params = req.params;
    const key = params.className + params.year;
    const data = await getSchedule(params.className, params.year);
    if( data.error ) {
        res.status(400).json(data);
    }else {
        res.status(200).json(data);
    }
};

export const allParams = async (req, res) => {
    const params = req.params;
    const key = params.className + params.year + params.week;
    const data = getSchedule(params.className, Number(params.year), Number(params.week));
    if( data.error ) {
        res.status(400).json(data);
    }else {
        res.status(200).json(data);
    }
};