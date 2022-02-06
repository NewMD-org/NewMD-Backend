import getSchedule from '../function/memoryTable.js';

export const onlyClassName = (req, res) => {
    let result;
    const params = req.params;
    getSchedule(params.className)
        .then(data => {
            if(!data.error) {
                console.log('success');
                result = data;
                res.status(200).json(result);
            } else {
                result = {
                    "error": data.error
                }
                res.status(200).json(result);
            }
        })
};

export const classNameWithYear = (req, res) => {
    let result = {};
    const params = req.params;
    getSchedule(params.className, Number(params.year))
        .then(data => {
            if (!data.error) {
                console.log('success');
                result = data;
                res.status(200).json(result);
            }
            else {
                result = {
                    "error": data.error
                }
                res.status(200).json(result);
            };
        });
};

export const allParams =  (req, res) => {
    let result = {};
    const params = req.params;
    getSchedule(params.className, Number(params.year), Number(params.week))
        .then(data => {
            if (!data.error) {
                console.log('success');
                result = data;
                res.status(200).json(result);
            }
            else {
                result = {
                    "error": data.error
                }
                res.status(200).json(result);
            };
        });
};