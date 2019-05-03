const express = require('express');
const loanController = require('../controllers/loan');
const { checkToken } = require('../middleware/auth');

const router = express.Router();
/**
 *
 * apply for loan router
 *
 */

router.post('/loans', checkToken, loanController.loanApply);
/**
 *
 * get compiled history
 *
 */
router.get('/compiled', checkToken, loanController.compiled);
/**
  *
  *
  * apply for loan repayment
  *
  */
router.post('/loans/:id/repayments', checkToken, loanController.repay);

/**
  *
  *
  * apply for loan repayment(admin)
  *
  */
router.post('/loans/repayments', loanController.repay);


/**
 *
 *
 * view loan repayment history
 *
 */

router.get('/loans/:id/repayments', checkToken, loanController.userRepayHist);

module.exports = router;
