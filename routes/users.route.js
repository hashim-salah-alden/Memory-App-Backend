const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users.controller");
const verfiyToken = require("../middleware/verifyToken");
const userRoles = require("../utils/userRoles");
const allowedTo = require("../middleware/allowedTo");

router.route("/register").post(usersController.register);

router.route("/login").post(usersController.login);

router
  .route("/:userId")
  .get()
  .patch()
  .delete(verfiyToken, allowedTo(userRoles.ADMIN), usersController.deleteUser);

module.exports = router;
