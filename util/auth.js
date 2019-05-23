import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

class Auth {
  static hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }

  static compareHash(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  }

  static genToken(email) {
    return jwt.sign({
      user: email,
    }, process.env.secret, { expiresIn: '24h' });
  }
}

export default Auth;
