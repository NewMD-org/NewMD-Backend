import express from 'express';
import cors from 'cors';
import API from './router/API.js';
import mdcloud from './router/MdCloud.js';

const app = express();

app.use(cors());

app.use('/API/', API);
app.use('/mdcloud/', mdcloud);

export default app;