/* eslint-disable no-undef */
const fetch = require('node-fetch')
const chai = require('chai');
const { expect, assert } = require('chai');
chai.use(require('chai-http'));
const app = require('../index.js');

describe('All Routes', () => {
  it('should signup a user with valid details', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'eleman',
        lastname: 'hillary',
        email: 'elemanhillary@gmail.com',
        workAddress: 'kampala',
        homeAddress: 'kampala',
        pin: '123456',
      })
      .then((res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.property('token');
        done();
      })
      .catch(err => done(err));
  });
  it('should not signup a user with invalid details', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'eleman',
        lastname: 'hillary',
        email: 'elemanhillary@gmail.com',
        workAddress: 'kampala',
        homeAddress: 'kampala',
        pin: '123'
      })
      .then((res) => {
        expect(res.status).to.be.equal(422);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        done();
      })
      .catch(err => done(err));
  });
  it('should not signup a user with already exist email', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'eleman',
        lastname: 'hillary',
        email: 'elemanhillary@gmail.com',
        workAddress: 'kampala',
        homeAddress: 'kampala',
        pin: '123456'
      })
      .then((res) => {
        expect(res.status).to.be.equal(409);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        done();
      })
      .catch(err => done(err));
  });
  it('should login user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'elemanhillary@gmail.com', pin: '123456' })
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('token');
        done();
      })
      .catch(error => done(error));
  });
  it('should not login user with invalid details', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'elemanhillary@gmail.com', pin: '12345' })
      .then((res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        done();
      })
      .catch(error => done(error));
  });
  it('should not login user with non-exist details(email), it should return 404', (done) => {
    chai.request(app)
      .post('/api/v1/auth/user/signin')
      .send({ email: 'elemanhillary@gmai.com', pin: '123456' })
      .then((res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        done();
      })
      .catch(error => done(error));
  });
  it('should get all users successfully', (done) => {
    chai.request(app)
      .get('/api/v1/users')
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });

   it('should verify a user', (done) => {
    chai.request(app)
      .patch('/api/v1/users/elemanhillary@gmail.com/verify')
      .then((res) => {
        expect(res.status).to.be.equal(202);
        expect(res.body).to.have.property('message');
        done();
      })
      .catch(error => done(error));
  });

  it('should not verified a user successfully', (done) => {
    chai.request(app)
      .patch('/api/v1/users/elemanhillary@gmai.com/verify')
      .then((res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.property('error');
        done();
      })
      .catch(error => done(error));
  });
  it('should not post a loan', (done) => {
    chai.request(app)
      .post('/api/v1/loans')
      .send({ amount: 13000.20, tenor: 3 })
      .then((res) => {
        expect(res.status).to.be.equal(422);
        expect(res.body).to.have.property('message');
        done();
      })
      .catch(error => done(error));
  });
  it('should not post a loan when amount exceeds loan type maximum amount', (done) => {
    chai.request(app)
      .post('/api/v1/loans')
      .send({
        usermail: 'elemanhillary@gmail.com',
        loanType: 'Agriculture Loan',
        amount: 20000000, 
        tenor: 3 })
      .then((res) => {
        expect(res.status).to.be.equal(403);
        expect(res.body).to.have.property('error');
        done();
      })
      .catch(error => done(error));
  });
    it('should post a loan application', (done) => {
    chai.request(app)
      .post('/api/v1/loans')
      .send({
        usermail: 'elemanhillary@gmail.com',
        loanType: 'Agriculture Loan',
        tenor: 3,
        amount: 2000,})
      .then((res) => {
        expect(res.status).to.be.equal(201);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
    it('should verify a loan application', (done) => {
    chai.request(app)
      .patch('/api/v1/loans/2')
      .send({status: 'approved'})
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('message');
        done();
      })
      .catch(error => done(error));
  });

    it('should post a loan repayment successfully', (done) => {
    chai.request(app)
      .post('/api/v1/loans/2/repayments')
      .send({amount: 200})
      .then((res) => {
        expect(res.status).to.be.equal(201);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
      it('should get all loan applications', (done) => {
    chai.request(app)
      .get('/api/v1/loans')
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should get a specific loan application', (done) => {
    chai.request(app)
      .get('/api/v1/loans/2')
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should not get a specific loan application', (done) => {
    chai.request(app)
      .get('/api/v1/loans/0')
      .then((res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.property('error');
        done();
      })
      .catch(error => done(error));
  });
  it('should retrieve a loan repayment', (done) => {
    chai.request(app)
      .get('/api/v1/loans/1/repayments')
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should not retrieve a loan repayment', (done) => {
    chai.request(app)
      .get('/api/v1/loan/0/repayments')
      .then((res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.property('error');
        done();
      })
      .catch(error => done(error));
  });
  it('should view current loans (not fully repaid)', (done) => {
    chai.request(app)
      .get('/api/v1/loans?status=approved&repaid=false')
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should reject a loan', (done) => {
    chai.request(app)
      .patch('/api/v1/loans/2')
      .send({ status: 'rejected' })
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('message');
        done();
      })
      .catch(error => done(error));
  });
});
