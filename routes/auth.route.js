const express = require('express');
const createHttpError = require('http-errors');
const router = express.Router();
const User = require('../models/User.model');
const { authSchema } = require('../helpers/validation_schema');
router.post('/register', async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    // console.log(result);
    const userWithEmail = await User.findOne({ email: result.email });
    if (userWithEmail) {
      throw createHttpError.Conflict(
        `${result.email} is already been registered`
      );
    }
    const user = new User(result);
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    if (err.isJoi) err.status = 422;
    next(err);
  }
});
router.post('/login', (req, res, next) => {
  res.send('login');
});
router.post('/refresh-token', (req, res, next) => {
  res.send('refresh token');
});
router.delete('/logout', (req, res, next) => {
  res.send('logout');
});
module.exports = router;
