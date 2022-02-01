const express = require('express');
const cors = require('cors');
const app = express();
const API = require('./router/API');
const mdcloud = require('./router/MdCloud');

app.use(cors());

app.use('/API/', API);
app.use('/mdcloud/', mdcloud);

module.exports = app;