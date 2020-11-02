const express = require('express');
const messages = require('./messages');
const router = express.Router;

const app = express();

const messages = require('./messages')
app.use("/api", messages);

app.listen(3000);