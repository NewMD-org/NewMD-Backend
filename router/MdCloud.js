const express = require('express');
const ACC = require('../function/login');
const stdData = require('../function/getIndexpage');
const fastTable = require('../function/fastTable');
const router = express.Router();

router.get('/', (_, res) => {
    res.send('請傳入參數');
});

router.get('/login/:id/:psd', (req, res) => {
    let params = req.params;
    ACC.login(params.id, params.psd)
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
});

router.get('/stdData/:cookie', (req, res) => {
    const params = req.params;
    stdData.getIndex(params.cookie)
        .then(data => {
            if (!data.error) {
                res.status(200).json(data);
            }
            else {
                res.status(404).json(data);
            };
        });
});

router.get('/fastTable/:id/:pwd', async (req, res) => {
    const params = req.params;
    fastTable.fastTable(params.id, params.pwd)
        .then(data => {
            res.status(200).json(data);
        }).catch(err => {
            console.log('something went wrong', err);
        })
});

module.exports = router;