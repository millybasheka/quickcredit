/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
/* eslint-disable no-else-return */
const { validateLoan, loanTypeAndLoanAmountChecker, amountValidate } = require('../helper/validate');
const { newUser, newApplication, newRepayment } = require('../helper/util');
const { loanTypesAmount } = require('../helper/helper');

/**
 *
 * @param {req} object
 * @param {res} object
 *
 * create a loan application */
const loanApply = (req, res) => {
  /* get LOAN post info from request body */
  const { error } = validateLoan(req.body);
  if (error) {
    return res.status(422).json({
      status: 422,
      message: error.details[0].message,
    });
  }
  const usermail = req.decoded.user.trim();
  const {
    loanType, tenor, amount,
  } = req.body;

  if (!Object.keys(loanTypesAmount).includes(loanType)) {
    res.status(404).json({ status: 404, error: `Loan Type must be one of ${Object.keys(loanTypesAmount)}` });
    return;
  }
  if (!newUser.checkEmail(usermail).bool) {
    res.status(404).json({ status: 404, error: 'You must be a user to apply loan' });
    return;
  }

  const { boolL, node } = newApplication.LcheckEmail(usermail);
  if (boolL) {
    if (newUser.checkEmail(usermail).bool && node.repaid === false) {
      res.status(404).json({ status: 404, error: 'user can only apply loan once or you have unpaid loan' });
      // eslint-disable-next-line no-useless-return
      return;
    } else {
      loanTypeAndLoanAmountChecker(res, usermail, loanType, tenor, amount);
    }
  } else {
    loanTypeAndLoanAmountChecker(res, usermail, loanType, tenor, amount);
  }
};

/**
 *
 * @param {req} object
 * @param {res} object
 *
 * get loans */
const getAll = (req, res) => {
  const { status, repaid } = req.query;
  if (Object.keys(req.query).length !== 0 && req.method === 'GET') {
    const repaidTrim = repaid.trim();
    let repaidBool;
    if (repaidTrim === 'true') {
      repaidBool = true;
    } else if (repaidTrim === 'false') {
      repaidBool = false;
    }
    const loans = [...newApplication];
    const returns = [];
    if (loans.length !== 0) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < loans.length; i++) {
        if (loans[i].status === status && loans[i].repaid === repaidBool) {
          returns.push(loans[i]);
        }
      }
    }
    if (returns.length !== 0) {
      res.status(200).json({ status: 200, data: returns });
      returns.length = 0;
      return;
    }
    res.status(404).send({ status: 404, error: 'content not found' });
    return;
  }

  if (newApplication.getSize() === 0) {
    res.status(404).json({ status: 404, error: 'no content found' });
  } else {
    res.status(200).json({ status: 200, data: [...newApplication] });
  }
};
/**
 *
 * @param {req} object
 * @param {res} object
 *
 * repay loan */
let idRe = 1;
const repay = (req, res) => {
  const LoanIdParam = req.params.id || newApplication.LcheckEmail(req.body.email).node.id;
  const LoanId = parseInt(LoanIdParam, 10);
  const paidAmount = parseFloat(req.body.amount);
  const { error } = amountValidate({ amount: paidAmount });
  if (error) {
    return res.status(422).json({
      status: 422,
      message: error.details[0].message,
    });
  }
  const { bool, node } = newApplication.checkCreds(LoanId);
  const { nodeR } = newRepayment.RcheckCreds(LoanId);
  const newAppHead = node;
  if (!bool) {
    res.status(404).json({ status: 404, error: 'not found' });
    return;
  }
  const dataArray = [idRe, newAppHead.loanType, LoanId, newAppHead.interest,
    paidAmount, newAppHead.amount, newAppHead.tenor, newAppHead.paymentInstallment];

  if (paidAmount > newAppHead.paymentInstallment) {
    res.status(404).json({ status: 404, error: `You are supposed to pay ${newAppHead.paymentInstallment} per month or less than please` });
    return;
  }

  if (bool && node.status === 'approved') {
    if (node.id === LoanId && node.repaid) {
      res.status(404).json({ status: 404, error: 'Loan already fully paid' });
    } else if (newRepayment.repayOnce(LoanId, paidAmount)) {
      node.balance = nodeR.balance;
      if (nodeR.balance <= 0) newApplication.toggleRepay(LoanId);
      res.status(201).json({ status: 201, Created: 'true', data: newRepayment.head.data });
    } else {
      newRepayment.insertRepay(...dataArray);
      node.balance = newRepayment.head.data.balance;
      if (newRepayment.head.data.balance <= 0) node.toggleRepay(LoanId);
      res.status(201).json({ status: 201, Created: 'true', data: newRepayment.head.data });
      idRe += 1;
    }
  } else {
    res.status(404).json({ status: 404, error: 'not found or loan not yet verified' });
  }
};

/**
 *
 * @param {res} object
 * @param {req} object
 *
 * repayment history */
const userRepayHist = (req, res) => {
  const LoanId = parseInt(req.params.id, 10);
  const { bool, node } = newRepayment.checkCreds(LoanId);
  if (req.method === 'GET' && bool === true) {
    res.status(200).json({ status: 200, data: node });
  } else {
    res.status(404).json({ status: 404, error: 'not found' });
  }
};

/**
 *
 * @param {res} object
 * @param {req} object
 *
 * view compiled repay and loan history */
const compiled = (req, res) => {
  const compiledLoans = [];
  const compiledLoansID = [];
  const compiledRepays = [];
  const loans = [...newApplication];
  const repays = [...newRepayment];
  if (loans.length === 0 || repays.length === 0) {
    res.status(404).json({ status: 404, error: 'not found' });
    return;
  }
  for (let i = 0; i < loans.length; i++) {
    if (loans[i].user === 'elemanhillary@gmail.com') {
      compiledLoansID.push(loans[i].id);
      compiledLoans.push(loans[i]);
    }
  }

  for (let i = 0; i < repays.length; i++) {
    compiledRepays.push(newRepayment.RcheckCreds(compiledLoansID[i]).nodeR);
  }
  res.status(200).json({ status: 200, loans: [...compiledLoans], repays: [...compiledRepays] });
};

module.exports = {
  userRepayHist,
  loanApply,
  getAll,
  repay,
  compiled,
};
