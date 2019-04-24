/* import required libraries */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crud = require('./v1/crud/crud.js');
/* declaration and definition of variables */
const app = express();
/* port to listen on */
const port =  process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/* create new user */
app.post('/api/v1/auth/signup', crud.signup);
/* login user */
app.post('/api/v1/auth/signin', crud.signin);
app.patch('/api/v1/users/:user_email/verify', crud.verify);
/* get a specific loan application */
app.get('/api/v1/loans/:loan_id', crud.getLoanApp);
/* get all loans */
app.get('/api/v1/loans', crud.loanApply);
app.get('/api/v1/loans/:loan_id/repayment', crud.userRepayHist);
/* create loan application */
app.post('/api/v1/loans', crud.loanApply);
/* repay specific loan application */
app.post('/api/v1/loans/:loan_id/repayment', crud.repay);
app.patch('/api/v1/loans/:loan_id', crud.verifyLoan);
/* get all users */
app.get('/api/v1/users', crud.users);
/* get all paid loans */
app.get('/api/v1/loans?status=approved&repaid=true', crud.loanApply);
app.get('/api/v1/loans?status=approved&repaid=false', crud.loanApply);

module.exports = app.listen(port);
