const express = require('express');
const createHttpError = require('http-errors');
const router = express.Router();
const User = require('../models/User.model');
router.post('/register', async (req, res, next) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw createHttpError.BadRequest();
    }
    const userWithEmail = await User.findOne({ email });
    if (userWithEmail) {
      throw createHttpError.Conflict(`${email} is already been registered`);
    }
    const user = new User({
      email,
      password,
    });
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
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
