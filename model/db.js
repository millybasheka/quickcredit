/* eslint-disable func-names */
/* classes starting with node shall represent tables */

/* table user */
class NodeUser {
  constructor(id, firstname, lastname, email, homeaddress,
    workaddress, password, isAdmin, next = null) {
    this.data = new function () {
      this.id = parseInt(id, 10);
      this.firstname = firstname;
      this.lastname = lastname;
      this.email = email;
      this.homeaddress = homeaddress;
      this.workaddress = workaddress;
      this.password = password;
      this.status = 'unverified';
      this.isAdmin = isAdmin;
      this.createdOn = new Date().toUTCString();
    }();
    this.next = next;
  }
}

/* table Loan */
class NodeLoan {
  constructor(id, user, loanType, tenor, amount, next = null) {
    this.data = new function () {
      this.id = parseInt(id, 10);
      this.user = user; /* user email */
      this.loanType = loanType;
      this.createdOn = new Date().toUTCString();
      this.status = 'pending';
      this.tenor = parseInt(tenor, 10);
      this.amount = parseFloat(amount, 10.0);
      this.interest = parseFloat((this.amount * this.tenor * 5) / 100, 10);
      this.repaid = false;
      this.paymentInstallment = parseFloat((this.amount + this.interest) / this.tenor,
        10.0);
      this.balance = parseFloat((this.amount + this.interest), 10.0);
    }();
    this.next = next;
  }
}

/* table Repayments */
class NodeRepayments {
  constructor(id, loanType, loanId, interest, paidAmount,
    amount, tenor, paymentInstallment, next = null) {
    this.data = new function () {
      this.id = parseInt(id, 10);
      this.loanType = loanType;
      this.loanId = parseInt(loanId, 10);
      this.createdOn = new Date().toUTCString();
      this.amount = parseFloat(amount, 10.0);
      this.monthlyInstallment = paymentInstallment;
      this.paidAmount = parseInt(paidAmount, 10.0);
      this.balance = parseFloat((amount + interest) - this.paidAmount, 10.0);
    }();
    this.next = next;
  }
}
module.exports = {
  NodeUser,
  NodeLoan,
  NodeRepayments,
};
