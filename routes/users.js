const express = require("express");
const passport = require("passport");
const User = require("../models/user");
const { storeReturnTo } = require("../utils/middleware");
const router = express.Router();

router.get("/register", (_req, res) => {
  res.render("users/register");
});

router.post("/register", storeReturnTo, async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    //login user right after registration
    req.login(registeredUser, (err) => {
      if (err) {
        req.flash("error", "Login error");
        return next(err);
      }
      //we need to put the redirect login inside the login callback as
      //putting it outside risks causing a redirect before the login process finishes
      req.flash("success", "Welcome to YelpCamp");
      const redirectUrl = req.session.returnTo || "/campgrounds";
      res.redirect(redirectUrl);
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
});

router.get("/login", (_req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  storeReturnTo,
  (req, res) => {
    req.flash("success", "Welcome Back to YelpCamp");
    const redirectUrl = req.session.returnTo || "/campgrounds";
    console.log(redirectUrl);
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash("error", "Logout error");
      return next(err);
    }
  });
  req.flash("success", "Logged out");
  res.redirect("/campgrounds");
});

module.exports = router;
