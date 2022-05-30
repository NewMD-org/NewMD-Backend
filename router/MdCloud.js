import express from 'express';
import { None, Login, StdData, directLogin } from '../controllers/cloud.js';

const router = express.Router();

router.get('/', None);

router.get('/login/:id/:psd', Login);

router.get('/stdData/:cookie', StdData);

router.get('/directlogin/:id/:pwd', directLogin);

export default router;