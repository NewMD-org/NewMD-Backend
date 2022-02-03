const express = require('express');
const API = require('../function/getTimetable');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('請傳入參數');
});

router.get('/:className', (req, res) => {
    let result;
    const params = req.params;
    API.getSchedule(params.className)
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
});

router.get('/:className/:year', (req, res) => {
    let result = {};
    const params = req.params;
    API.getSchedule(params.className, Number(params.year))
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
});

router.get('/:className/:year/:week', (req, res) => {
    let result = {};
    const params = req.params;
    API.getSchedule(params.className, Number(params.year), Number(params.week))
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
});

module.exports = router;