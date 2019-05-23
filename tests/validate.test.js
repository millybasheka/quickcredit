import { expect } from 'chai';
import validate from '../util/validation';

const login = {
  email: 'elemanhillary@gmail.com',
  pin: '123456',
};

const loan = {
  usermail: 'elemanhillary@gmail.com',
  loanType: 'Auto Loan',
  tenor: 12,
  amount: 3000,
};

const user = {
  firstname: 'eleman',
  lastname: 'hillary',
  email: 'elemanhillary@gmail.com',
  workAddress: 'kampala',
  homeAddress: 'kampala',
  pin: '123456',
};

describe('validation', () => {
  let result;
  it('Should validate sign up', () => {
    result = validate.validateSignup(user);
    expect(result).to.be.a('object');
  });
  it('Should validate login', () => {
    result = validate.validateLogin(login);
    expect(result).to.be.a('object');
  });
  it('Should successfully validate user loan', () => {
    result = validate.validateLoan(loan);
    expect(result).to.be.a('object');
  });
  it('Should successfully validate loan verification', () => {
    result = validate.validateLoanStatus({ status: 'approved' });
    expect(result).to.be.a('object');
  });
  it('Should not successfully validate user status if status is not verified or rejected', () => {
    result = validate.validateUserStatus({ status: 'approval' });
    expect(result).to.be.a('object');
  });
  it('validate amount as a number', () => {
    result = validate.validateAmount({ amount: 200 });
    expect(result).to.be.a('object');
  });
  it('validate admin repay', () => {
    result = validate.validateAdminRepay({ email: 'adm@admin.com', amount: 3000 });
    expect(result).to.be.a('object');
  });
});
