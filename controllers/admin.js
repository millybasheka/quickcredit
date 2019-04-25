const { newUser, newApplication } = require('../helper/util');

let id;
/**
 * @param {req} object
 * @param {res} object
 *
/* get a specific loan application */
const getLoanApp = (req, res) => {
  id = parseInt(req.params.id, 10);
  const loanApplication = newApplication.getAt(id);
  if (loanApplication === null) res.status(404).send({ status: 404, error: 'not found' });
  else res.status(200).send({ status: 200, data: loanApplication });
};

/**
 * @param {req} object
 * @param {res} object
 *
/* verify user */
const verify = (req, res) => {
  const email = req.params.email;
  const { bool } = newUser.verifyUser(email);
  if (!bool) res.status(404).json({ status: 404, error: 'not found' });
  else res.status(200).json({ status: 200, message: 'verified' });
};

/**
 * @param {req} object
 * @param {res} object
 *
/* verify loan */
const verifyLoan = (req, res) => {
  const idLoan = req.params.id;
  const { status } = req.body;
  const { bool } = newApplication.verifyLoan(parseInt(idLoan, 10), status);
  if (!bool) res.status(404).json({ status: 404, error: 'not found ' });
  else res.status(200).json({ status: 200, message: status });
};

/**
 * @param {req} object
 * @param {res} object
 *
 * veiw all users */
const users = (req, res) => {
  if (Object.keys(newUser).length > 0) {
    res.status(200).json({ status: 200, data: [...newUser] });
  } else {
    res.status(404).send({ status: 404, error: 'not found' });
  }
};

module.exports = {
  getLoanApp,
  verify,
  verifyLoan,
  users,
};
