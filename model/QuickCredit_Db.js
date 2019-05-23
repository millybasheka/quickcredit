import { query } from '../config/config';

const users = `CREATE TABLE IF NOT EXISTS
    users(
      id SERIAL,
      firstname VARCHAR(24) NOT NULL,
      lastname VARCHAR(10) NOT NULL,
      email VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(80) NOT NULL,
      workaddress VARCHAR(50) NOT NULL,
      homeaddress VARCHAR(50) NOT NULL,
      status VARCHAR(80) NOT NULL DEFAULT 'unverified',
      isAdmin BOOLEAN NOT NULL DEFAULT false,
      PRIMARY KEY (id)
    )`;
const loans = `CREATE TABLE IF NOT EXISTS
  loans(
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL REFERENCES users(email) ON DELETE CASCADE ON UPDATE CASCADE,
    loanType TEXT NOT NULL,
    "createdOn" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    tenor INT NOT NULL,
    amount FLOAT NOT NULL,
    interest FLOAT NOT NULL,
    "repaid" BOOLEAN NOT NULL DEFAULT false,
    paymentInstallment FLOAT,
    balance FLOAT NOT NULL
  )`;
const repayments = `CREATE TABLE IF NOT EXISTS
  repayments(
    id SERIAL PRIMARY KEY,
    loantype TEXT NOT NULL,
    loanId INT NOT NULL REFERENCES loans(id) ON DELETE CASCADE ON UPDATE CASCADE,
    createdOn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    amount FLOAT NOT NULL,
    monthlyInstallment FLOAT NOT NULL,
    paidAmount FLOAT NOT NULL,
    balance FLOAT NOT NULL
  )`;

const loanTypes = ` CREATE TABLE IF NOT EXISTS
loantypes(
  id SERIAL PRIMARY KEY,
  "Agriculture Loan" INT NOT NULL,
  "Mortgage Loan" INT NOT NULL,
  "Salary Loan" INT NOT NULL,
  "Auto Loan" INT NOT NULL,
  "School Fees Loan" INT NOT NULL,
  "Refinance Loan" INT NOT NULL
)`;

module.exports = async () => {
  try {
    await query(users);
    await query(loans);
    await query(repayments);
    await query(loanTypes);
    await query(`INSERT INTO loantypes ("Agriculture Loan", "Mortgage Loan", "Salary Loan",
    "Auto Loan", "School Fees Loan", "Refinance Loan") VALUES (3000, 60000, 10000, 45000, 1000000, 60000)`);
  } catch (e) {
    throw e;
  }
};

require('make-runnable');
