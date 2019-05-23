import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import users from '../routes/users';
import admin from '../routes/admin';
import loans from '../routes/loans';
import dotenv from 'dotenv';

dotenv.config()


const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/v2', admin);
app.use('/api/v2', loans);
app.use('/api/v2/auth', users);
app.use('/home', (_req, res) => {
  res.status(200).json({
    status: 200,
    message: 'welcome to quickcredit API version 2',
  });
});
app.all('*', (_req, res) => {
  res.status(400).json({
    status: 400,
    message: 'route doesnot exist',
  });
});
app.listen(process.env.PORT || PORT);

export default app;
