import express from 'express';
import { None, Login, StdData, FastTable } from '../controllers/cloud.js';

const router = express.Router();

router.get('/', None);

router.get('/login/:id/:psd', Login);

router.get('/stdData/:cookie', StdData);

router.get('/fastTable/:id/:pwd', FastTable);

export default router;