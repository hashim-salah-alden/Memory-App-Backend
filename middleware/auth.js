const jwt = require("jsonwebtoken");
const User = require("../models/users.model");

async function verifyToken(req, res, next) {
  try {


    const authHeader = req.cookies["SessionID"]; // get the session cookie from request header

    if (!authHeader) return res.sendStatus(401); // if there is no cookie from request header, send an unauthorized response.
    const cookie = authHeader.split("=")[1]; // If there is, split the cookie string to get the actual jwt

    // Verify using jwt to see if token has been tampered with or if it has expired.
    // that's like checking the integrity of the cookie
    jwt.verify(cookie, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        // if token has been altered or has expired, return an unauthorized error
        return res
          .status(401)
          .json({ message: "This session has expired. Please login again" });
      }

      const { id } = decoded; // get user id from the decoded token
      const user = await User.findById(id); // find user by that `id`
      const { password, ...data } = user._doc; // return user object without the password
      req.user = data; // put the data object into req.user
      next();
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Internal Server Error",
    });
  }
}

function authenticateToken(req, res, next) {
  const token = req.headers?.["authorization"].split(" ")[1]; // Using optional chaining

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403).json({ message: err });
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken, verifyToken };
