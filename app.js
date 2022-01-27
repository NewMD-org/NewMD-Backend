const express = require('express');
const app = express();
const API = require('./router/API');

app.use('/API/', API);

module.exports = app;