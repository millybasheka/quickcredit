import { query } from '../config/config';

const isAdmin = async (req, res, next) => {
  const email = req.decoded.user;
  try {
    const { rows } = await query('SELECT * FROM users where email = $1', [email]);
    if (rows[0].isadmin) {
      next();
    } else {
      res.status(403).json({
        status: 403,
        message: 'Admin only',
      });
    }
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.detail,
    });
  }
};

export default isAdmin;
