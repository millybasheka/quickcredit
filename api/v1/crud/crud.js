/* eslint-disable no-else-return */
/* eslint-disable no-useless-return */
/* we are doing this cause of the ERR_RESENT HEADER */
const { NodeUser, NodeLoan, NodeRepayments } = require('../databasenonPersistent/database');
/* loan types and there maximum amounts */
const loanTypesAmount = {
  'Refinance Loan': 60000,
  'Agriculture Loan': 3000,
  'Auto Loan': 45000,
  'Mortgage Loan': 60000,
  'School Fees Loan': 1000000,
  'Salary Loan': 10000,
};
Object.freeze(loanTypesAmount);

/* Use LinkedList for all of our operations and it will handle all tables */
class LinkedList {
  construct() {
    this.head = null;
  }

  /* inserts info into our NodeUser(table user) */
  insertUser(...args) {
    /* using arguments to make it neutral to any amount of arguments */
    const newNode = new NodeUser(...args, this.head);
    newNode.next = this.head;
    this.head = newNode;
    return this;
  }

  insertLoan(...args) {
    const newNode = new NodeLoan(...args, this.head);
    newNode.next = this.head;
    this.head = newNode;
    return this;
  }

  insertRepay(...args) {
    const newNode = new NodeRepayments(...args, this.head);
    newNode.next = this.head;
    this.head = newNode;
    return this;
  }

  /* getAt retrieves user or loan with primary key given in method argument */
  getAt(id) {
    let node = this.head;
    while (node) {
      /* if node.id is equal to id then we are at the right node */
      if (node.data.id === id) return node.data;
      node = node.next;
    }
    return null;
  }

  getSize() {
    let counter = 0;
    let node = this.head;
    while (node) {
      counter += 1;
      node = node.next;
    }
    return counter;
  }

  /* check whether credentials exit and return an object containing boolean and node */
  checkCreds(...args) {
    let node = this.head;
    if (args.length === 2) {
      while (node) {
        /* if func args match email and password in node return true */
        if (node.data.email === args[0] && node.data.password === args[1]) {
          return { bool: true, node: node.data };
        }
        /* loop the whole node */
        node = node.next;
      }
      return { bool: false, node: null };
    }
    /* we shall use this also to get user(info) by email */
    while (node) {
      /* if func args match email or id return true */
      if (node.data.id === args[0]) return { bool: true, node: node.data };
      /* loop the whole node */
      node = node.next;
    }
    return { bool: false, node: null };
  }

  /* repayment */
  RcheckCreds(id) {
    let node = this.head;
    while (node) {
      /* if func args match email or id return true */
      if (node.data.loanId === id) return { boolR: true, nodeR: node.data };
      /* loop the whole node */
      node = node.next;
    }
    return { boolR: false, nodeR: null };
  }

  /* check email if exist */
  checkEmail(email) {
    let node = this.head;
    while (node) {
      if (node.data.email === email) return { bool: true, node: node.data };
      node = node.next;
    }
    return { bool: false, node: null };
  }

  /* check if email exist in loans */
  LcheckEmail(email) {
    let node = this.head;
    while (node) {
      if (node.data.user === email) return { boolL: true, node: node.data };
      node = node.next;
    }
    return { boolL: false, node: null };
  }

  /* check repaid boolean, if its false user can only apply loan once
  * if its true user can request for a new loan */
  checkRepaid(email) {
    let node = this.head;
    while (node) {
      if (node.data.user === email) {
        if (node.data.repaid === true) return true;
      }
      node = node.next;
    }
    return false;
  }

  /* check loans approved or rejected or pending and repaid or not */
  checkLoans(status, repaid) {
    let node = this.head;
    while (node) {
      if (node.data.status === status && node.data.repaid === repaid) {
        return { retBool: true, retNode: node };
      }
      node = node.next;
    }
    return { retBool: false, retNode: null };
  }

  verifyUser(email) {
    let node = this.head;
    while (node) {
      if (node.data.email === email) {
        node.data.status = 'verified';
        return { bool: true, node };
      }
      node = node.next;
    }
    return { bool: false, node: null };
  }

  /* if client repays fully toggle repaid to true */
  toggleRepay(id) {
    let node = this.head;
    while (node) {
      if (node.data.id === id) {
        node.data.repaid = true;
      }
      node = node.next;
    }
  }

  /* we dont want duplicate repays so we shall use this method */
  repayOnce(id, amount) {
    let node = this.head;
    while (node) {
      if (node.data.loanId === id) {
        node.data.paidAmount = amount;
        node.data.balance -= node.data.paidAmount;
        return true;
      }
      node = node.next;
    }
    return false;
  }

  /* method need only do a basic traversal of the list and yield the data that
  /* each node contains, so we make our linked list iterable since its not */
  * [Symbol.iterator]() {
    let node = this.head;
    while (node) {
      yield node.data;
      node = node.next;
    }
  }

  verifyLoan(id, status) {
    let node = this.head;
    while (node) {
      if (node.data.id === id) {
        node.data.status = status;
        /* they are not nodes they are statuses */
        return { bool: true, node: status };
      }
      node = node.next;
    }
    return { bool: false, node: status };
  }
}

const newUser = new LinkedList();
const newApplication = new LinkedList();
const newRepayment = new LinkedList();
/* on each insertion we shall be incrementing the id */
let id = 1;
let data;

/* some users are tinkers they might send unknown request body to our api and
* and of which the api may do a valid reponse with invalid request so we make
* sure the request body contains exact constants the api expects */
/* first argument is the req body and the second is what the api expects */
const isRequestValid = (...args) => {
  if (Object.prototype.toString.call(args[0]) !== '[object Object]' &&
    Object.prototype.toString.call(args[1]) !== '[object Array]') {
    throw new Error('expected an object and an array');
  }
  const reqBodyKeys = Array.from(Object.keys(args[0]));
  for (let rbk of reqBodyKeys) {
    for (let expected of args[1]) {
      return rbk === expected;
    }
  }
  return false;
}
/* user siginup */
const signup = (req, res) => {
  /* get user post info from request body */
  const {
    firstname, lastname, email, homeAddress, workAddress, pin,
  } = req.body;

  const expected = ['firstname', 'lastname', 'email', 'homeAddress', 'workAddress', 'pin']
  const returnValue = isRequestValid(req.body, expected);

  if(!returnValue){
    res.status(500).json({ status: 500, error: 'Bad Request'});
    return;
  }
  let isAdmin = false;
  /* check if all fields all not empty */
  if (firstname === '' || lastname === '' || email === '' || homeAddress === ''
  || workAddress === '' || pin === '') {
    res.status(404).json({ status: 404, error: 'all fields must not be empty' });
    return;
  }

  /* if password is less than 4 emit error */
  if (pin.length < 4) {
    res.status(404).json({ status: 404, error: 'password is short(must be greater than four characters)' });
    return;
  } else {
    /* checks if email contains string 'admin' and if its at the beginning, 
    /* the flag isAdmin is toggled on. though its vulnerable a use can do 
    elemanhillary@gmail.com@admin.com  to gain admin access */
    if (email.includes('admin') && email.indexOf('admin') === 0) {
      isAdmin = true;
    }
    /* check whether a user exist, we only check email cause its unique,
    /* rather than names which are always similar */
    const { bool } = newUser.checkEmail(email);
    if (bool) {
      res.status(404).json({ status: 404, error: 'user already exist with such email' });
    } else {
      /* store them in an array, and increment the id as primary key */
      const userInfo = [id, firstname, lastname, email, homeAddress, workAddress, pin, isAdmin];
      id += 1;
      /* spread array for user info insertion */
      newUser.insertUser(...userInfo);
      data = newUser.head.data;
      res.status(201).json({ status: 201, Created: 'true', data });
    }
    return;
  }
};
/* user signin */
const signin = (req, res) => {
  /* get creds from req.body its an object */
  const { email, pin } = req.body;
  const result = Object.assign(newUser.checkCreds(email, pin));
  const { bool, node } = result;
  /* check if checkCreds() returned true to authenticate user otherwise dont */
  if (bool) {
    /* show success by status code */
    data = node;
    res.status(200).json({ status: 200, Success: 'true', data });
  } else {
    res.status(404).json({ status: 404, error: 'incorrect password or email' });
  }
};
/* check if amount is greater than loan type maximum amount */
const loanTypeAndLoanAmountChecker = (res, ...args) => {
  if (parseFloat(args[4]) > parseFloat(loanTypesAmount[args[2]])) {
    res.status(404).json({ status: 404, error: `maximum loan amount for ${args[2]} is ${loanTypesAmount[args[2]]}` });
  } else {
    newApplication.insertLoan(...args);
    data = newApplication.head.data;
    res.status(201).json({ status: 201, Created: 'true', data });
  }
};

/* create a loan application */
let idL = 1;
const loanApply = (req, res) => {
  /* get LOAN post info from request body */
  const {
    LoanId, usermail, loanType, tenor, amount,
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
    const { retBool, retNode } = newApplication.checkLoans(status, repaidBool);
    if (!retBool) {
      res.status(404).send({ status: 404, error: 'content not found' });
      return;
    } else {
      res.status(200).json({ status: 200, data: retNode });
      return;
    }
  }

  if (req.method === 'GET') {
    if (newApplication.getSize() === 0) {
      res.status(404).json({ status: 404, error: 'no content found' });
      /* we have to stop further execution with a return statement as without it it would
      /* generate an error ERR_HTTP_HEADERS_SENT: Cannot set headers after
      /* they are sent to the client */
      return;
    } else {
      res.status(200).json({ status: 200, data: [...newApplication] });
      /* we have to stop further execution with a return statement as without it it would
      /* generate an error ERR_HTTP_HEADERS_SENT: Cannot set headers after
      /* they are sent to the client */
      return;
    }
  }

  if (LoanId === '' || usermail === '' || loanType === '' || tenor === '' || amount === '') {
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
    // const LoanIdParsed = parseInt(LoanId, 10.0);
    // const { bool, node } = newApplication.checkCreds(LoanIdParsed);
    // if(!newUser.checkCreds(LoanIdParsed).bool){
    //   res.status(500).json({ status: 500, error: 'Bad Request' });
    //   return;
    // }
    // if (newUser.checkCreds(LoanIdParsed).node.email !== usermail) {
    //   res.status(404).json({ status: 404, error: 'thats not your user id, check user id given at signup and reapply' });
    //   return;
    // }
    // if (bool && node.repaid === false) {
    //   res.status(404).json({ status: 404, error: 'error encountered, its because you have unapproved loan application with false repayment' });
    //   return;
    // }

    const { boolL } = newApplication.LcheckEmail(usermail);
    if (boolL) {
      if (newUser.checkEmail(usermail).bool && newApplication.head.data.repaid === false) {
        res.status(404).json({ status: 404, error: 'user can only apply loan once or you have unpaid loan' });
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
/* get a specific loan application */
const getLoanApp = (req, res) => {
  id = parseInt(req.params.loan_id, 10);
  const loanApplication = newApplication.getAt(id);
  if (loanApplication === null) res.status(404).send({ status: 404, error: 'not found' });
  else res.status(200).send({ status: 200, data: loanApplication });
};
/* verify user */
const verify = (req, res) => {
  const email = req.params.user_email;
  const { bool } = newUser.verifyUser(email);
  if (!bool) res.status(404).json({ status: 404, error: 'not found' });
  else res.status(200).json({ status: 200, message: 'verified' });
};
/* verify loan */
const verifyLoan = (req, res) => {
  const idLoan = req.params.loan_id;
  const { status } = req.body;
  const { bool } = newApplication.verifyLoan(parseInt(idLoan, 10), status);
  if (!bool) res.status(404).json({ status: 404, error: 'not found ' });
  else res.status(200).json({ status: 200, message: status });
};
/* repay loan */
let idRe = 1;
const repay = (req, res) => {
  const LoanIdParam = req.params.loan_id;
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

const userRepayHist = (req, res) => {
  const LoanId = parseInt(req.params.loan_id, 10);
  const { bool, node } = newRepayment.checkCreds(LoanId);
  if (req.method === 'GET' && bool === true) {
    res.status(200).send({ status: 200, data: node });
  } else {
    res.status(404).send({ status: 404, error: 'not found' });
  }
};

const users = (req, res) => {
  if (Object.keys(newUser).length > 0) {
    res.status(200).json({ status: 200, data: [...newUser] });
  } else {
    res.status(404).send({ status: 404, error: 'not found' });
  }
};
/* export functions to be used in external files */
module.exports = {
  signup,
  signin,
  loanApply,
  getLoanApp,
  verify,
  verifyLoan,
  repay,
  userRepayHist,
  LinkedList,
  users,
};
