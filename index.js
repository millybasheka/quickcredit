const cors = require('cors');
const express = require('express');
const path = require('path');
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
 * Docs
 *
 */
app.use(express.static(path.join(__dirname, 'doc')));
app.get('/ap1/v1/docs', function(req, res) {
    res.sendFile('index.html');
});

/**
 *
 * Home page
 *
 */
 app.use('/home', (req, res) => {
 	res.status(200).json({
 		status: 200,
 		text: 'Welcome to QuickCredit API'
 	});
 });

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

const port = process.env.PORT || 3000;
app.listen(port);
module.exports = app
