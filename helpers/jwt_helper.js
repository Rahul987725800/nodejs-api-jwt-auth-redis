const JWT = require('jsonwebtoken');
const createError = require('http-errors');
module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      // these fields should be set in either
      // options or payload
      const payload = {
        // aud: userId,
        // exp: Date.now() / 1000 + 60 * 60,
        // iss: 'skartner.com',
      };
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: '15s',
        issuer: 'skartner.com',
        audience: userId,
      };
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          return reject(createError.InternalServerError()); // 500 InternalServerError
        }
        resolve(token);
      });
    });
  },
  verifyAccessToken: (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return next(
        createError.Unauthorized('Protected route authorization header not set')
      ); //  401 Unauthorized
      // don't return the message that authorization header not set
      // simply return unauthorized
    }
    const bearerToken = authHeader.split(' ');
    // bearerToken[0] = Bearer
    const token = bearerToken[1];
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        // Error validating the token
        // console.log(err);
        console.log(err.name);
        if (err.name === 'TokenExpiredError') {
          return next(createError.Unauthorized(err.message));
        } else {
          // err.name === 'JsonWebTokenError'
          return next(createError.Unauthorized('Invalid token'));
          // here you should not send err.message
          // it will be like invalid signature
          // the client may use another signature
          // simply send Unauthorized
        }
      }
      req.payload = payload;
      // attach payload to req
      next();
    });
  },
};
