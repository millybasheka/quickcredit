/* eslint-disable no-else-return */
const { loanTypeAndLoanAmountChecker } = require('../helper/validate');
const { newUser, newApplication, newRepayment } = require('../helper/util');
const { loanTypesAmount } = require('../helper/helper');

/**
 *
 * @param {req} object
 * @param {res} object
 *
 * create a loan application */
let idL = 1;
const loanApply = (req, res) => {
  /* get LOAN post info from request body */
  const {
    usermail, loanType, tenor, amount,
  } = req.body;
  const { status, repaid } = req.query;
  if (Object.keys(req.query).length !== 0 && req.method === 'GET') {
    const repaidTrim = repaid.trim();
    let repaidBool;
    if (repaidTrim === 'true') {
      repaidBool = true;
    } else {
      repaidBool = false;
    }
    const { retBool, node } = newApplication.checkLoans(status, repaidBool);
    if (!retBool) {
      res.status(404).send({ status: 404, error: 'content not found' });
      return;
    }
    res.status(200).json({ status: 200, data: node});
    return;
  }

  if (req.method === 'GET') {
    if (newApplication.getSize() === 0) {
      res.status(404).json({ status: 404, error: 'no content found' });
      return;
    } else {
      res.status(200).json({ status: 200, data: [...newApplication] });
      return;
    }
  }

  if (usermail === '' || loanType === '' || tenor === '' || amount === '') {
    res.status(404).json({ status: 404, error: 'some field are empty' });
  } else {
    if (!Object.keys(loanTypesAmount).includes(loanType)) {
      res.status(404).json({ status: 404, error: `Loan Type must be one of ${Object.keys(loanTypesAmount)}` });
      return;
    }
    if (!newUser.checkEmail(usermail).bool) {
      res.status(404).json({ status: 404, error: 'You must be a user to apply loan' });
      return;
    }

    const { boolL } = newApplication.LcheckEmail(usermail);
    if (boolL) {
      if (newUser.checkEmail(usermail).bool && newApplication.head.data.repaid === false) {
        res.status(404).json({ status: 404, error: 'user can only apply loan once or you have unpaid loan' });
        // eslint-disable-next-line no-useless-return
        return;
      } else {
        loanTypeAndLoanAmountChecker(res, idL, usermail, loanType, tenor, amount);
        idL += 1;
        /* we have to stop further execution with a return statement as without it it would
        /* generate an error ERR_HTTP_HEADERS_SENT: Cannot set headers after
        /* they are sent to the client */
      }
    } else {
      loanTypeAndLoanAmountChecker(res, idL, usermail, loanType, tenor, amount);
      idL += 1;
    }
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
  const LoanIdParam = req.params.id;
  const LoanId = parseInt(LoanIdParam, 10);
  const paidAmount = req.body.amount;
  const { bool, node } = newApplication.checkCreds(LoanId);
  const { nodeR } = newRepayment.RcheckCreds(LoanId);
  const newAppHead = node;
  if (!bool) {
    res.status(404).json({ status: 404, error: 'not found' });
    return;
  }
  const dataArray = [idRe, newAppHead.loanType, LoanId, newAppHead.interest,
    parseFloat(paidAmount), newAppHead.amount, newAppHead.tenor, newAppHead.paymentInstallment];

  if (paidAmount > newAppHead.paymentInstallment) {
    res.status(404).json({ status: 404, error: `You are supposed to pay ${newAppHead.paymentInstallment} per month or less than please` });
    return;
  }

  if (bool && node.status === 'approved') {
    if (node.id === LoanId && node.repaid) {
      res.status(404).json({ status: 404, error: 'Loan already fully paid' });
    } else if (newRepayment.repayOnce(LoanId, parseFloat(paidAmount))) {
      node.balance = nodeR.balance;
      if (nodeR.balance === 0) newApplication.toggleRepay(LoanId);
      res.status(201).json({ status: 201, Created: 'true', data: newRepayment.head.data });
    } else {
      newRepayment.insertRepay(...dataArray);
      node.balance = newRepayment.balance;
      if (newRepayment.balance === 0) node.toggleRepay(LoanId);
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
    res.status(200).send({ status: 200, data: node });
  } else {
    res.status(404).send({ status: 404, error: 'not found' });
  }
};

module.exports = {
  userRepayHist,
  loanApply,
  repay,
};
