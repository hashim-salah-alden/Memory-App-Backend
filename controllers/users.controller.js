const User = require("../models/users.model");
const appError = require("../utils/AppError");
const bcrypt = require("bcryptjs");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middleware/asyncWrapper");
const { generateToken } = require("../utils/generateJWT");

const register = asyncWrapper(async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const existUser = await User.findOne({ email: email });

    if (existUser) {
      const error = appError.create(
        "User Already Exsists",
        400,
        httpStatusText.FAIL
      );
      return next(error);
    }

    const hashedPaswword = await bcrypt.hash(password.toString(), 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPaswword,
      role,
    });

    const savedUser = await newUser.save();

    const { password: savedpassword, ...userData } = savedUser._doc;

    await savedUser.save();
    res.status(201).json({ status: httpStatusText.SUCCESS, data: userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Internal Server Error",
    });
  }
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // if not thire email or password
    if ((!email && !password) || !email || !password) {
      const error = appError.create(
        "Email And Password Are Required",
        400,
        httpStatusText.FAIL
      );
      return next(error);
    }
    const user = await User.findOne({ email: email });
    // if typed email but this email dosenot exist in  database
    if (!user) {
      const error = appError.create("User Not Found", 401, httpStatusText.FAIL);
      return next(error);
    }

    const matchedPassword = await bcrypt.compare(
      password.toString(),
      user.password
    );
    if (user && matchedPassword) {
      let options = {
        maxAge: 90 * 24 * 60 * 60 * 1000, // would expire in 20minutes
        httpOnly: true, // The cookie is only accessible by the web server
        secure: true,
        sameSite: "strict",
      };
      const token = await generateToken({
        email: user.email,
        id: user._id,
        role: user.role,
      });
      res.cookie("SessionID", token, options, { httpOnly: true });

      const { password, ...userData } = user._doc;

      return res.json({
        status: httpStatusText.SUCCESS,
        user: userData,
        token,
      });
    } else {
      const error = appError.create(
        "something wrong",
        500,
        httpStatusText.ERROR
      );
      return next(error);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Internal Server Error",
    });
  }
});

const deleteUser = asyncWrapper(async (req, res, next) => {
  const userId = req.params.userId;
  await User.deleteOne({ _id: userId });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});

module.exports = {
  register,
  login,
  deleteUser,
};
