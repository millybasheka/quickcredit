/* eslint-disable no-undef */
const fetch = require('node-fetch')
const chai = require('chai');
const { expect, assert } = require('chai');
const { LinkedList, newUser } = require('../v1/crud/crud');
chai.use(require('chai-http'));
const app = require('../index.js');

describe('Linked List', () => {
  it('Should implement insertUser', () => {
    const LL = new LinkedList();
    LL.insertUser(...[1, 'eleman', 'hillary', 'elemanhillary@gmail.com', 'kampala', 'kampala', '1234', false]);
    assert.equal(LL.head.data.id, 1);
  });
  it('Should implement getSize', () => {
    const LL = new LinkedList();
    LL.insertUser(...[1, 'eleman', 'hillary', 'elemanhillary@gmail.com', 'kampala', 'kampala', '1234', false]);
    assert.equal(LL.getSize(), 1);
  });
  it('Should implement getAt', () => {
    const LL = new LinkedList();
    LL.insertUser(...[1, 'eleman', 'hillary', 'elemanhillary@gmail.com', 'kampala', 'kampala', '1234', false]);
    assert.equal(LL.getAt(1).firstname, 'eleman');
  });
  it('Should implement checkCreds', () => {
    const LL = new LinkedList();
    LL.insertUser(...[1, 'eleman', 'hillary', 'elemanhillary@gmail.com', 'kampala', 'kampala', '1234', false]);
    assert.equal(LL.checkCreds('elemanhillary@gmail.com', '1234').bool, true);
    assert.equal(LL.checkCreds('elemanhillary@gmail.com', '1234').node.password, '1234');
  });
  it('Should implement checkEmail', () => {
    const LL = new LinkedList();
    LL.insertUser(...[1, 'eleman', 'hillary', 'elemanhillary@gmail.com', 'kampala', 'kampala', '1234', false]);
    assert.equal(LL.checkEmail('elemanhillary@gmail.com').bool, true);
  });
  it('Should implement checkRepaid', () => {
    const LL = new LinkedList();
    LL.insertLoan(...[1, 'elemanhillary@gmail.com', 'Auto Loan', 1, 4000]);
    assert.equal(LL.checkRepaid(1), false);
  });
  it('Should implement checkLoans', () => {
    const LL = new LinkedList();
    LL.insertLoan(...[1, 'elemanhillary@gmail.com', 'Auto Loan', 1, 4000]);
    assert.equal(LL.checkLoans('pending', false).retBool, true);
  });
  it('Should implement verifyUser', () => {
    const LL = new LinkedList();
    LL.insertUser(...[1, 'eleman', 'hillary', 'elemanhillary@gmail.com', 'kampala', 'kampala', '1234', false]);
    assert.equal(LL.verifyUser('elemanhillary@gmail.com').bool, true);
    assert.equal(LL.verifyUser('elemanhillary@gmail.com').node.data.status, 'verified');
  });
  it('Should implement toggleRepay', () => {
    const LL = new LinkedList();
    LL.insertLoan(...[1, 'elemanhillary@gmail.com', 'Auto Loan', 1, 4000]);
    LL.toggleRepay(1);
    assert.equal(LL.head.data.repaid, true);
  });
  it('Should implement verifyLoan', () => {
    const LL = new LinkedList();
    LL.insertLoan(...[1, 'elemanhillary@gmail.com', 'Auto Loan', 1, 4000]);
    LL.verifyLoan(1, 'approved');
    assert.equal(LL.head.data.status, 'approved');
  });
});

describe('QUICKCREDIT TESTING', () => {
  describe('Post /', () => {
    describe('API endpoint /api/v1/auth/signup', () => {
      it('it should add a new user', (done) => {
        const user = {
          firstname: 'eleman',
          lastname: 'hillary',
          email: 'elemanhillary@gmail.com',
          homeAddress: 'kampala',
          workAddress: 'kampala',
          pin: '1234',
        };
        chai.request(app)
          .post('/api/v1/auth/signup')
          .send(user)
          .end((_err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('status');
            expect(res.body.data).to.have.property('lastname');
            expect(res.body.data).to.have.property('email');
            expect(res.body.data).to.have.property('homeaddress');
            expect(res.body.data).to.have.property('workaddress');
            expect(res.body.data).to.have.property('password');
            expect(res.body).to.have.property('Created').equal('true');
            expect(typeof res.body).to.be.equal('object');
            done();
          });
      });
      it('it should not post new user when all or one field is empty', (done) => {
        const user = {
          firstname: '',
          lastname: '',
          email: '',
          homeAddress: '',
          workAddress: '',
          pin: '',
        };
        chai.request(app)
          .post('/api/v1/auth/signup')
          .send(user)
          .end((_err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('error').equal('all fields must not be empty');
            expect(typeof res.body).to.be.equal('object');
            done();
          });
      });
      it('it should not post when password is less than four characters', (done) => {
        const user = {
          firstname: 'eleman',
          lastname: 'hillary',
          email: 'elemanhillary@gmail.com',
          homeAddress: 'kampala',
          workAddress: 'kampala',
          pin: '123',
        };
        chai.request(app)
          .post('/api/v1/auth/signup')
          .send(user)
          .end((_err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error').equal('password is short(must be greater than four characters)');
            expect(typeof res.body).to.be.equal('object');
            done();
          });
      });
    });

    describe('API endpoint /api/v1/auth/signin', () => {
      it('it should login user', (done) => {
        const user = {
          firstname: 'eleman',
          lastname: 'hillary',
          email: 'elemanhillary@gmail.com',
          homeAddress: 'kampala',
          workAddress: 'kampala',
          pin: '1234',
        };
        chai.request(app)
          .post('/api/v1/auth/signin')
          .send(user)
          .end((_err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.data).to.have.property('lastname');
            expect(res.body.data).to.have.property('email');
            expect(res.body.data).to.have.property('homeaddress');
            expect(res.body.data).to.have.property('workaddress');
            expect(res.body.data).to.have.property('password');
            expect(typeof res.body.data.id).to.be.equal('number');
            done();
          });
      });
      it('it should not login user with incorrect password', (done) => {
        const user = {
          firstname: 'eleman',
          lastname: 'hillary',
          email: 'elemanhillary@gmail.com',
          homeAddress: 'kampala',
          workAddress: 'kampala',
          pin: '123',
        };
        chai.request(app)
          .post('/api/v1/auth/signin')
          .send(user)
          .end((_err, res) => {
            expect(res).to.have.status(404);
            expect(typeof res.body).to.be.equal('object');
            expect(res.body).to.have.property('error');
            expect(res.body).to.have.property('error').equal('incorrect password or email');
            done();
          });
      });
      it('it should not login user with incorrect email', (done) => {
        const user = {
          firstname: 'eleman',
          lastname: 'hillary',
          email: 'lemanhillary@gmail.com',
          homeAddress: 'kampala',
          workAddress: 'kampala',
          pin: '1234',
        };
        chai.request(app)
          .post('/api/v1/auth/signin')
          .send(user)
          .end((_err, res) => {
            expect(res).to.have.status(404);
            expect(typeof res.body).to.be.equal('object');
            expect(res.body).to.have.property('error');
            expect(res.body).to.have.property('error').equal('incorrect password or email');
            done();
          });
      });
    });

    describe('API endpoint /api/v1/loans', () => {
      it('it should post new loan', (done) => {
        const loanApplication = {
          id: 1,
          usermail: 'elemanhillary@gmail.com',
          loanType: 'Mortgage Loan',
          tenor: 1,
          amount: 4000,
        };
        chai.request(app)
          .post('/api/v1/loans')
          .send(loanApplication)
          .end((_err, res) => {
            expect(res.body).to.have.status(201);
            expect(res.body).to.have.property('Created');
            expect(res.body).to.have.property('Created').equal('true');
            done();
          });
      });
    });
    describe('PATCH API endpoint /api/v1/loans/:loan_id', () => {
      it('it should verify a loan', (done) => {
        const verify = {
          status: "approved",
        };
        chai.request(app)
          .patch('/api/v1/loans/1')
          .send(verify)
          .end((_err, res) => {
            expect(res.body).to.have.status(200);
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('message').equal('approved');
            done();
          });
      });
    });
    describe('API endpoint /api/v1/loans/:loan_id/repayment', () => {
      it('it should make a repayment to a specified loan', (done) => {
        const paidAmount = {
          amount: 200,
        };

        chai.request(app)
          .post('/api/v1/loans/1/repayment')
          .send(paidAmount)
          .end((_err, res) => {
            expect(res.body).to.have.status(201);
            expect(res.body).to.have.property('Created');
            expect(res.body.data).to.have.property('loanType');
            expect(res.body.data).to.have.property('loanType').equal('Mortgage Loan');
            done();
          });
      });
    });
  });
  describe('PATCH /', () => {
    describe('/api/v1/users/:user_email/verify', () => {
      it('it should update user status to verified', (done) => {
        chai.request(app)
          .patch('/api/v1/users/elemanhillary@gmail.com/verify')
          .end((_err, res) => {
            expect(res).to.have.status(200);
            expect(typeof res.body).to.be.equal('object');
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('message').equal('verified');
            done();
          });
      });
      it('it should not update user status to verified when user doesnot exist', (done) => {
        chai.request(app)
          .patch('/api/v1/users/emanhillary@gmail.com/verify')
          .end((_err, res) => {
            expect(res).to.have.status(404);
            expect(typeof res.body).to.be.equal('object');
            expect(res.body).to.have.property('error');
            expect(res.body).to.have.property('error').equal('not found');
            done();
          });
      });
    });
  });
describe('GET /', () => {      
  describe('API endpoint /api/v1/loans/', () => {
      it('it should get a loan applications', (done) => {
        chai.request(app)
          .get('/api/v1/loans')
          .end((_err, res) => {
            expect(res.body).to.have.status(200);
            expect(res.body.data[0]).to.have.property('id');
            expect(res.body.data[0]).to.have.property('tenor');
            expect(res.body.data[0]).to.have.property('loanType');
            expect(res.body.data[0]).to.have.property('createdOn');
            expect(res.body.data[0]).to.have.property('id').equal(1);
            done();
          });
      });
    });
        describe('API endpoint /api/v1/loans/:loan_id/', () => {
      it('it should get a a specific loan application', (done) => {
        chai.request(app)
          .get('/api/v1/loans/1')
          .end((_err, res) => {
            expect(res.body).to.have.status(200);
            expect(res.body.data).to.have.property('id');
            expect(res.body.data).to.have.property('id').equal(1);
            done();
          });
      });
    });
      describe('API endpoint /api/v1/loans/:loan_id/repayment', () => {
      it('it should get a repayment history', (done) => {
        chai.request(app)
          .get('/api/v1/loans/1/repayment')
          .end((_err, res) => {
            expect(res.body).to.have.status(200);
            expect(res.body.data).to.have.property('id');
            expect(res.body.data).to.have.property('id').equal(1);
            done();
          });
      });
    });
});
});
