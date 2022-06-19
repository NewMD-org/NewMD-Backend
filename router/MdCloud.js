import express from 'express';
import { none, login, table, database } from '../controllers/cloud.js';


const router = express.Router();

router.get('/', none);

router.post('/users/login', login);
// router.post('/users/logout', logout);
// query: [ID, PWD]

router.post('/table', table);
// query: [ID, PWD, meetURL?]

router.post('/database/:action?', database);
// param: [save, read]
// query: [ID, PWD]

/* PAUSED */
// router.get('/stdData/:cookie', StdData);

export default router;