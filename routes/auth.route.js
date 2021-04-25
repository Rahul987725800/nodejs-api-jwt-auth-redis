const express = require('express');
const createHttpError = require('http-errors');
const router = express.Router();
const User = require('../models/User.model');
const { authSchema } = require('../helpers/validation_schema');
const { signAccessToken, signRefreshToken } = require('../helpers/jwt_helper');
router.post('/register', async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    // console.log(result);
    const userWithEmail = await User.findOne({ email: result.email });
    if (userWithEmail) {
      throw createHttpError.Conflict(
        `${result.email} is already been registered`
      );
      // 409 Conflict
    }
    const user = new User(result);
    const savedUser = await user.save();
    const accessToken = await signAccessToken(savedUser.id);
    const refreshToken = await signRefreshToken(savedUser.id);
    res.send({ accessToken, refreshToken });
  } catch (err) {
    if (err.isJoi) err.status = 422; //  422 Unprocessable Entity
    next(err);
  }
});
router.post('/login', async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    const user = await User.findOne({ email: result.email });
    if (!user) throw createHttpError.NotFound('User not registered'); // 404 Not Found
    const isMatch = await user.isValidPassword(result.password);
    if (!isMatch)
      throw createHttpError.Unauthorized('Username/Password not valid');
    // 401 Unauthorized
    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);
    res.send({ accessToken, refreshToken });
  } catch (err) {
    if (err.isJoi)
      return next(createHttpError.BadRequest('Invalid Username/Password'));
    // 400 Bad Request
    next(err);
  }
});
router.post('/refresh-token', (req, res, next) => {
  res.send('refresh token');
});
router.delete('/logout', (req, res, next) => {
  res.send('logout');
});
module.exports = router;
