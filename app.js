require('dotenv').config();
require('./helpers/init_mongodb');
const redisClient = require('./helpers/init_redis');
const express = require('express');
const morgan = require('morgan');
const createHttpError = require('http-errors');
const authRoute = require('./routes/auth.route');
const { verifyAccessToken } = require('./helpers/jwt_helper');
const app = express();
// redisClient.SET('foo', 'ghanta');
// redisClient.GET('foo', (err, value) => {
//   if (err) console.log(err.message);
//   console.log(value);
// });
app.use(morgan('dev'));
// for json body
app.use(express.json());
// for form data
// app.use(express.urlencoded({ extended: true }));
app.get('/', verifyAccessToken, (req, res, next) => {
  // console.log(req.headers['authorization']);
  // console.log(req.payload); // this attached after jwt verification
  res.send('Hello from express');
});
app.use('/auth', authRoute);
app.use((req, res, next) => {
  // const error = new Error('Not found');
  // error.status = 404;
  // next(error);
  // when we call next(error) from any part of code
  // we will handle it in the handler below
  // it will receive error passed as first param

  // alternative
  next(createHttpError.NotFound());
  // message can be passed as arg to NotFound
  // next(createError.NotFound("Invalid route"));
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on: ${PORT}`);
});
