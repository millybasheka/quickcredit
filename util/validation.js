import Joi from '@hapi/joi';

class validate {
  static validateSignup(user) {
    const schema = Joi.object().keys({
      firstname: Joi.string().regex(/^[A-Z]+$/).trim().uppercase()
        .required(),
      lastname: Joi.string().regex(/^[A-Z]+$/).trim().uppercase()
        .required(),
      email: Joi.string().email().trim().required(),
      workAddress: Joi.string().trim().required(),
      homeAddress: Joi.string().trim().required(),
      pin: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).trim().min(6)
        .max(30)
        .required(),
    });

    return Joi.validate(user, schema);
  }

  static validateLogin(user) {
    const schema = Joi.object().keys({
      email: Joi.string().email().trim().required(),
      pin: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).trim().required(),
    });
    return Joi.validate(user, schema);
  }

  static validateLoan(loan) {
    const schema = Joi.object().keys({
      loanType: Joi.string().trim().required(),
      tenor: Joi.number().integer().min(1).max(12)
        .required(),
      amount: Joi.number().integer().required(),
    });
    return Joi.validate(loan, schema);
  }

  static validateLoanStatus(loan) {
    const schema = Joi.object().keys({
      status: Joi.string().insensitive().valid('approved', 'rejected').required(),
    });
    return Joi.validate(loan, schema);
  }

  static validateUserStatus(loan) {
    const schema = Joi.object().keys({
      status: Joi.string().insensitive().valid('verified', 'rejected').required(),
    });
    return Joi.validate(loan, schema);
  }

  static validateAmount(amount) {
    const schema = Joi.object().keys({
      amount: Joi.number().required(),
    });
    return Joi.validate(amount, schema);
  }

  static validateAdminRepay(email) {
    const schema = Joi.object().keys({
      amount: Joi.number().required(),
      email: Joi.string().email().required(),
    });
    return Joi.validate(email, schema);
  }
}
module.exports = validate;
