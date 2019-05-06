/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../helper/config');

// eslint-disable-next-line consistent-return
const checkToken = (req, res, next) => {
  let token = req.headers.authorization || req.headers['x-access-token'];
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid',
        });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied',
    });
  }
};

module.exports = {
  checkToken,
};
