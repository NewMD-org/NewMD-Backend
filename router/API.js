import express from 'express';
import { onlyClassName, twoParams, allParams } from '../controllers/API.js';
const router = express.Router();

router.get('/', (req, res) => {
    res.send('請傳入參數');
});

router.get('/:className', onlyClassName);

router.get('/:a/:b', twoParams);
//id, pwd
//className, year

router.get('/:className/:year/:week', allParams);

export default router;