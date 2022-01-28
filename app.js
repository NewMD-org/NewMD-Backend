const express = require('express');
const cors = require('cors');
const app = express();
const API = require('./router/API');

app.use(cors());

app.use('/API/', API);

module.exports = app;