const express = require('express');
const adminController = require('../controllers/admin');
const { loanApply } = require('../controllers/loan');

const router = express.Router();
/**
 *
 * Admin can mark a user as verified
 *
 */
router.patch('/users/:email/verify', adminController.verify);

/**
 *
 * Admin can mark a loan approved, rejected
 *
 */
router.patch('/loans/:id', adminController.verifyLoan);

/**
  *
  * Admin can view a specific loan
  *
  */
router.get('/loans/:id', adminController.getLoanApp);

/**
   *
   * Admin can view all specific loan
   *
   */
router.get('/loans', loanApply);

/**
  *
  * Admin can view all users
  */
router.get('/users', adminController.users);

module.exports = router;
