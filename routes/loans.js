import express from 'express';
import checkToken from '../middleware/isAuth';
import { loanApply, repayLoanHist, repay } from '../controllers/loans';

const router = express.Router();

router.post('/loans', checkToken, loanApply);
router.post('/loans/:id/repayment', checkToken, repay);
router.get('/loans/:id/repayment', checkToken, repayLoanHist);

export default router;
