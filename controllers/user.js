/* eslint-disable consistent-return */
const { genToken } = require('../helper/helper');
const { validateSignUp, validateLogin } = require('../helper/validate');
const { newUser } = require('../helper/util');
const { hashPassword, comparePassword } = require('../helper/helper');

/**
 *
 * @param {res} object
 * @param {req} object
 *
 * user siginup */
let id = 1;
let data;
const signup = (req, res) => {
  /* get user post info from request body */
  const { error } = validateSignUp(req.body);
  if (error) {
    return res.status(422).json({
      status: 422,
      message: error.details[0].message,
    });
  }
  const {
    firstname, lastname, email, homeAddress, workAddress, pin,
  } = req.body;

  let isAdmin = false;
  const hashedPassword = hashPassword(pin);
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
    res.status(409).json({ status: 409, error: 'user already exist with such email' });
    return;
  }
  /* store them in an array, and increment the id as primary key */
  const userInfo = [id, firstname, lastname, email, homeAddress,
    workAddress, hashedPassword, isAdmin];
  id += 1;
  /* spread array for user info insertion */
  newUser.insertUser(...userInfo);
  const token = genToken(newUser.head.data.email);
  // eslint-disable-next-line prefer-destructuring
  data = newUser.head.data;
  res.status(201).json({
    status: 201, Created: 'true', token, data,
  });
  // eslint-disable-next-line no-useless-return
  return;
};

/**
 *
 * @param {req} object
 * @param {res} object
 *
 * user signin */
const signin = (req, res) => {
  /* get creds from req.body its an object */
  const { error } = validateLogin(req.body);
  if (error) {
    return res.status(422).json({
      status: 422,
      message: error.details[0].message,
    });
  }
  const { email, pin } = req.body;
  const cp = comparePassword(newUser.head.data.password, pin);
  const result = Object.assign(newUser.checkEmail(email));
  const { bool, node } = result;
  /* check if checkCreds() returned true to authenticate user otherwise dont */
  if (bool && cp) {
    /* show success by status code */
    const token = genToken(email);
    data = node;
    return res.status(200).json({
      status: 200, Success: 'true', token, data,
    });
  }
  return res.status(401).json({
    status: 401,
    message: 'Authentication failed',
  });
};

module.exports = {
  signup,
  signin,
};
