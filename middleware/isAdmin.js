const { newUser } = require('../helper/util');

const checkAdmin = (req, res, next) => {
  if (req.decoded) {
    const email = req.decoded.user.trim();
    const { isAdmin } = newUser.checkEmail(email).node;
    if (isAdmin) {
      next();
    } else {
      res.status(401).json({ status: 401, error: 'Admin only please' });
    }
  } else {
    res.status(499).json({ status: 422, error: 'unprocessible entity' });
  }
};

module.exports = {
  checkAdmin,
};
