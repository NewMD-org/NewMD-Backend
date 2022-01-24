const express = require('express');
const app = express();
const index = require('./router/index');

app.use('/', index);

module.exports = app;