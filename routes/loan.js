const express = require('express');
const loanController = require('../controllers/loan');

const router = express.Router();
/**
 *
 * apply for loan router
 *
 */

router.post('/loans', loanController.loanApply);

/**
  *
  *
  * apply for loan repayment
  *
  */
router.post('/loans/:id/repayments', loanController.repay);


/**
 *
 *
 * view loan repayment history
 *
 */

router.get('/loans/:id/repayments', loanController.userRepayHist);

module.exports = router;
