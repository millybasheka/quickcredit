/* eslint-disable no-restricted-syntax */
const { loanTypesAmount } = require('./helper');
const { newApplication } = require('../helper/util');

let data;
/**
 * @params {args} array
 *
 * some users are tinkers they might send unknown request body to our api and
 * and of which the api may do a valid reponse with invalid request so we make
 * sure the request body contains exact constants the api expects
 * first argument is the req body and the second is what the api expects */
const isRequestValid = (...args) => {
  if (Object.prototype.toString.call(args[0]) !== '[object Object]'
    && Object.prototype.toString.call(args[1]) !== '[object Array]') {
    throw new Error('expected an object and an array');
  }
  const reqBodyKeys = Array.from(Object.keys(args[0]));
  for (const rbk of reqBodyKeys) {
    for (const expected of args[1]) {
      return rbk === expected;
    }
  }
  return false;
};

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
  isRequestValid,
  loanTypeAndLoanAmountChecker,
};
