import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import vhost from 'vhost';
import mdcloud from './router/MdCloud.js';
import API from './router/API.js';


const cloud = express();
cloud.use(bodyParser.urlencoded({ extended: true }));
cloud.use(bodyParser.json());
cloud.use('/', mdcloud);

const api = express();
api.use(cors());
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());
api.use('/', API);

const app = express();
const host = process.env.HOST || 'localhost';
app.use(vhost("cloud." + host, cloud));
app.use(vhost("api." + host, api));

export default app;