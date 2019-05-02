const express = require('express');
const adminController = require('../controllers/admin');
const loanController = require('../controllers/loan');
const { checkToken } = require('../middleware/auth');
const { checkAdmin } = require('../middleware/isAdmin');

const router = express.Router();
/**
 *
 * Admin can mark a user as verified
 *
 */
router.patch('/users/:email/verify', checkToken, checkAdmin, adminController.verify);

/**
 *
 * Admin can mark a loan approved, rejected
 *
 */
router.patch('/loans/:id', checkToken, checkAdmin, adminController.verifyLoan);

/**
  *
  * Admin can view a specific loan
  *
  */
router.get('/loans/:id', checkToken, checkAdmin, adminController.getLoanApp);

/**
   *
   * Admin can view all specific loan
   *
   */
router.get('/loans', checkToken, checkAdmin, loanController.getAll);

/**
  *
  * Admin can view all users
  */
router.get('/users', checkToken, checkAdmin, adminController.users);

module.exports = router;
