import express from 'express';
import { None, Login, StdData, table, database } from '../controllers/cloud.js';

const router = express.Router();

router.get('/', None);

router.get('/login/:id/:psd', Login);

router.get('/stdData/:cookie', StdData);

router.get('/table/:id/:pwd', table);

router.get('/database/:id/:pwd/:action', database);

export default router;