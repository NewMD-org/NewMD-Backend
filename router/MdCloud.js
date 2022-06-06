import express from 'express';
import { none, Login, table, database } from '../controllers/cloud.js';


const router = express.Router();

router.get('/', none);

router.get('/login', Login);
// query: [ID, PWD]

router.get('/table', table);
// query: [ID, PWD, meetURL?]

router.get('/database/:action?', database);
// param: [save, read]
// query: [ID, PWD]

/* PAUSED */
// router.get('/stdData/:cookie', StdData);

export default router;