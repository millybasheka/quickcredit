const http = require('http');
const cors = require('cors');
const express = require('express');
const bodyparser = require('body-parser');
const users = require('./routes/user');
const loans = require('./routes/loan');
const admin = require('./routes/admin');

const app = express();

app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

/**
 *
 * API routes
 *
 */
app.use('/api/v1/auth', users);
app.use('/api/v1', loans);
app.use('/api/v1', admin);

/**
 *
 * Handle non exist route with with proper message
 *
 */
app.all('*', (req, res) => {
  res.status(404).json({
    status: 404,
    error: 'Wrong request. Route does not exist',
  });
});

const server = http.createServer(app);
const port = process.env.PORT || 3000;
module.exports = server.listen(port);
