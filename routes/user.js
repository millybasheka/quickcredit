const express = require('express');
const userController = require('../controllers/user');

const router = express.Router();
/**
 *
 * user can signup
 *
 */
router.post('/signup', userController.signup);

/**
  *
  * user can signin
  *
  */
router.post('/signin', userController.signin);

module.exports = router;
