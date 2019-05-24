/* eslint-disable consistent-return */
import { query } from '../config/config';
import validate from '../util/validation';
import Auth from '../util/auth';

export const signup = async (req, res) => {
  const { error } = validate.validateSignup(req.body);
  if (error) {
    res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  }

  const {
    firstname, lastname, email,
    workAddress, homeAddress, pin,
  } = req.body;
  const hashedPassword = Auth.hashPassword(pin);
  try {
    const { rows } = await query(`INSERT INTO users (firstname, lastname, email,
      workaddress, homeaddress, password) VALUES ($1, $2, $3, $4, $5, $6) returning *`,
    [firstname, lastname, email, workAddress, homeAddress, hashedPassword]);
    res.status(201).json({
      status: 201,
      Created: true,
      data: {
        id: rows[0].id,
        firstname: rows[0].firstname.trim(),
        lastname: rows[0].lastname,
        email: rows[0].email,
        homeaddress: rows[0].homeaddress,
        workaddress: rows[0].workaddress,
      },
    });
  } catch (e) {
    if (e.detail.match('exists').length > 0) {
      res.status(409).json({
        status: 409,
        message: 'user already exist',
      });
    } else {
      res.status(400).json({
        status: 400,
        message: e.detail,
      });
    }
  }
};

export const signin = async (req, res) => {
  const { error } = validate.validateLogin(req.body);
  if (error) {
    res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  }

  const { email, pin } = req.body;
  const token = Auth.genToken(email);
  try {
    const { rows } = await query('SELECT * FROM users where email = $1', [email]);
    if (rows.length < 1) {
      return res.status(201).json({
        status: 204,
        message: 'no user found',
      });
    }
    const authBoolean = Auth.compareHash(pin, rows[0].password);
    if (authBoolean) {
      res.status(200).json({
        status: 200,
        Success: authBoolean,
        token,
        data: {
          id: rows[0].id,
          firstname: rows[0].firstname.trim(),
          lastname: rows[0].lastname,
          email: rows[0].email,
          homeaddress: rows[0].homeaddress,
          workaddress: rows[0].workaddress,
        },
      });
    } else {
      res.status(401).json({
        status: 401,
        message: 'Wrong email or password',
      });
    }
  } catch (e) {
    throw new Error(e);
  }
};
