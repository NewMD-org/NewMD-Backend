import express from 'express';
import { onlyClassName, classNameWithYear, allParams } from '../controllers/API.js';
const router = express.Router();

router.get('/', (req, res) => {
    res.send('請傳入參數');
});

router.get('/:className', onlyClassName);

router.get('/:className/:year', classNameWithYear);

router.get('/:className/:year/:week', allParams);

export default router;