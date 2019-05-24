import chai, { expect } from 'chai';
import faker from 'faker';
import app from '../src/index';
import { query } from '../config/config';

chai.use(require('chai-http'));

let token;
let adminToken;
let loanId;
let repayID;
const email = faker.internet.email();

describe('All Routes', () => {
  before(() => {
    query('TRUNCATE TABLE users CASCADE')
      .then(result => result)
      .catch(err => err);
    query('TRUNCATE TABLE loans CASCADE')
      .then(result => result)
      .catch(err => err);
    query('TRUNCATE TABLE repayments CASCADE')
      .then(result => result)
      .catch(err => err);
  });
  it('should signup a user with valid details', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signup')
      .send({
        firstname: 'eleman',
        lastname: 'hillary',
        email: 'elemanhillary@gmail.com',
        workAddress: 'kampala',
        homeAddress: 'kampala',
        pin: '123456',
      })
      .then((res) => {
        // eslint-disable-next-line prefer-destructuring
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(err => done(err));
  });
  it('should not signup a user with invalid details', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signup')
      .send({
        firstname: 'eleman',
        lastname: 'hillary',
        workAddress: 'kampala',
        homeAddress: 'kampala',
        pin: '123',
      })
      .then((res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        done();
      })
      .catch(err => done(err));
  });
  it('should not signup a user with already exist email', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signup')
      .send({
        firstname: 'eleman',
        lastname: 'hillary',
        email: 'elemanhillary@gmail.com',
        workAddress: 'kampala',
        homeAddress: 'kampala',
        pin: '123456',
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
      .post('/api/v2/auth/signin')
      .send({ email: 'elemanhillary@gmail.com', pin: '123456' })
      .then((res) => {
        ({ token } = res.body);
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('token');
        done();
      })
      .catch(error => done(error));
  });
  it('should not login user with invalid details', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signin')
      .send({ email })
      .then((res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        done();
      })
      .catch(error => done(error));
  });
  it('should not login user with non-exist details(email), it should return 404', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signin')
      .send({ email: 'elel@gmail.com', pin: '123456' })
      .then((res) => {
        expect(res.body.status).to.be.equal(204);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        done();
      })
      .catch(error => done(error));
  });
  it('should signup an Admin  with valid details', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signup')
      .send({
        firstname: 'eleman',
        lastname: 'hillary',
        email: 'admin@admin.com',
        workAddress: 'kampala',
        homeAddress: 'kampala',
        pin: '123456',
      })
      .then((res) => {
        query('UPDATE users SET isAdmin = true where email = \'admin@admin.com\'')
          .then(result => result)
          .catch(err => err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(err => done(err));
  });
  it('should signin an Admin  with valid details', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signin')
      .send({
        email: 'admin@admin.com',
        pin: '123456',
      })
      .then((res) => {
        // eslint-disable-next-line prefer-destructuring
        adminToken = res.body.token;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.property('token');
        done();
      })
      .catch(err => done(err));
  });
  it('should get all users successfully', (done) => {
    chai.request(app)
      .get('/api/v2/users')
      .set('Authorization', adminToken)
      .then((res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should verify a user', (done) => {
    chai.request(app)
      .patch('/api/v2/users/elemanhillary@gmail.com/verify')
      .set('Authorization', adminToken)
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('message');
        done();
      })
      .catch(error => done(error));
  });

  it('should not verified a user successfully', (done) => {
    chai.request(app)
      .patch('/api/v2/users/elemanhillary@gmai.com/verify')
      .set('Authorization', adminToken)
      .then((res) => {
        expect(res.statusCode).to.be.equal(204);
        done();
      })
      .catch(error => done(error));
  });
  it('should not post a loan', (done) => {
    chai.request(app)
      .post('/api/v2/loans')
      .set('Authorization', token)
      .send({ amount: 13000.20, tenor: 3 })
      .then((res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body).to.have.property('message');
        done();
      })
      .catch(error => done(error));
  });
  // it('should not post a loan when amount exceeds loan type maximum amount', (done) => {
  //   chai.request(app)
  //     .post('/api/v2/loans')
  //     .set('Authorization', token)
  //     .send({
  //       loanType: 'Agriculture Loan',
  //       amount: 20000000,
  //       tenor: 3,
  //     })
  //     .then((res) => {
  //       expect(res.status).to.be.equal(403);
  //       expect(res.body).to.have.property('error');
  //       done();
  //     })
  //     .catch(error => done(error));
  // });
  it('should post a loan application', (done) => {
    chai.request(app)
      .post('/api/v2/loans')
      .set('Authorization', token)
      .send({
        loanType: 'Agriculture Loan',
        tenor: 4,
        amount: 3000,
      })
      .then((res) => {
        loanId = res.body.data.id;
        expect(res.body.status).to.be.equal(201);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should verify a loan application', (done) => {
    chai.request(app)
      .patch(`/api/v2/loans/${loanId}`)
      .send({ status: 'approved' })
      .set('Authorization', adminToken)
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('message');
        done();
      })
      .catch(error => done(error));
  });
  it('should view current loans (not fully repaid)', (done) => {
    chai.request(app)
      .get('/api/v2/loans?status=approved&repaid=false')
      .set('Authorization', adminToken)
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should post a loan repayment successfully', (done) => {
    chai.request(app)
      .post(`/api/v2/loans/${loanId}/repayment`)
      .set('Authorization', token)
      .send({ amount: 900 })
      .then((res) => {
        expect(res.status).to.be.equal(201);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('2 should post a loan repayment successfully (ADMIN)', (done) => {
    chai.request(app)
      .post('/api/v2/loans/repayment')
      .set('Authorization', adminToken)
      .send({ amount: 2700, email: 'elemanhillary@gmail.com' })
      .then((res) => {
        repayID = res.body.data.id;
        expect(res.status).to.be.equal(201);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should get all loan applications', (done) => {
    chai.request(app)
      .get('/api/v2/loans')
      .set('Authorization', adminToken)
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should get a specific loan application', (done) => {
    chai.request(app)
      .get(`/api/v2/loans/${loanId}`)
      .set('Authorization', adminToken)
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should not get a specific loan application', (done) => {
    chai.request(app)
      .get('/api/v2/loans/0')
      .set('Authorization', adminToken)
      .then((res) => {
        expect(res.statusCode).to.be.equal(204);
        done();
      })
      .catch(error => done(error));
  });
  it('should retrieve a loan repayment', (done) => {
    chai.request(app)
      .get(`/api/v2/loans/${repayID}/repayment`)
      .set('Authorization', token)
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should not retrieve a loan repayment', (done) => {
    chai.request(app)
      .get('/api/v2/loans/0/repayment')
      .set('Authorization', token)
      .then((res) => {
        expect(res.statusCode).to.be.equal(204);
        done();
      })
      .catch(error => done(error));
  });
  it('should view current loans (fully repaid)', (done) => {
    chai.request(app)
      .get('/api/v2/loans?status=approved&repaid=true')
      .set('Authorization', adminToken)
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should reject a loan', (done) => {
    chai.request(app)
      .patch(`/api/v2/loans/${loanId}`)
      .send({ status: 'rejected' })
      .set('Authorization', adminToken)
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('message');
        done();
      })
      .catch(error => done(error));
  });
});
