const express = require('express');
const API = require('../function/login');
const router = express.Router();

router.get('/', (_, res) => {
    res.send('請傳入參數');
});

router.get('/login/:id/:psd', (req, res) => {
    let params = req.params;
    API.login(params.id, params.psd)
        .then(data => {
            if (!data.error) {
                res.status(200).json({
                     status: data.status, 
                     cookie: data.cookie 
                });
            }else {
                res.status(404).json(data);
            }
        })
});

module.exports = router;