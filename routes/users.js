const express = require("express");
const passport = require("passport");
const { storeReturnTo } = require("../utils/middleware");
const usersController = require("../controllers/users");
const router = express.Router();

//register get and post routes
router
  .route("/register")
  .get(usersController.renderRegisterForm)
  .post(storeReturnTo, usersController.registerUser);

//login get and post routes
router
  .route("/login")
  .get(usersController.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    storeReturnTo,
    usersController.loginUser
  );

router.get("/logout", usersController.logoutUser);

module.exports = router;
