/* eslint-disable no-restricted-syntax */
const { loanTypesAmount } = require('./helper');
const { newApplication } = require('../helper/util');

let data;

/**
 *
 * @params {res} object
 * @params {args} array
 *
 * check if amount is greater than loan type maximum amount */
const loanTypeAndLoanAmountChecker = (res, ...args) => {
  if (parseFloat(args[4]) > parseFloat(loanTypesAmount[args[2]])) {
    res.status(404).json({ status: 404, error: `maximum loan amount for ${args[2]} is ${loanTypesAmount[args[2]]}` });
  } else {
    newApplication.insertLoan(...args);
    data = newApplication.head.data;
    res.status(201).json({ status: 201, Created: 'true', data });
  }
};

module.exports = {
  loanTypeAndLoanAmountChecker,
};
