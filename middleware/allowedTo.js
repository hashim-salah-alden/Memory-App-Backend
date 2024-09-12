const appError = require("../utils/AppError");
const httpStatusText = require("../utils/httpStatusText");

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      const errror = appError.create(
        "this role is not authorized",
        httpStatusText.ERROR
      );
      return next(errror);
    }
    next();
  };
};
