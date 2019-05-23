import express from 'express';
import {
  getUsers, verifyUser, getLoan, verifyLoan,
} from '../controllers/admin';
import { getALL, adminrepay } from '../controllers/loans';
import isAdmin from '../middleware/isAdmin';
import checkToken from '../middleware/isAuth';

const router = express.Router();

router.get('/users', checkToken, isAdmin, getUsers);
router.patch('/users/:email/verify', checkToken, isAdmin, verifyUser);
router.get('/loans/:id', checkToken, isAdmin, getLoan);
router.patch('/loans/:id', checkToken, isAdmin, verifyLoan);
router.get('/loans', checkToken, isAdmin, getALL);
router.post('/loans/repayment', checkToken, isAdmin, adminrepay);

export default router;
