const jwt = require("jsonwebtoken");

function generateToken(payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "1y",
  });

  return token;
}

function generateRefreshToken(payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "90d",
  });
  return token;
}

module.exports = { generateToken, generateRefreshToken };
