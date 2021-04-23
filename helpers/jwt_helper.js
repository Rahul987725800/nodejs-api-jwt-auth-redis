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
        expiresIn: '1h',
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
};
