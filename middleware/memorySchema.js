const { body } = require("express-validator");

const memorySchema = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("title is required")
      .isLength({ min: 2 })
      .withMessage("title at least is 2 digits"),
  ];
};

module.exports = { memorySchema };



