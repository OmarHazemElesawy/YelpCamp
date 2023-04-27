const User = require("../models/user");


module.exports.renderRegisterForm = (_req, res) => {
  res.render("users/register");
};

module.exports.registerUser = async (req, res) => {
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
};

module.exports.renderLoginForm = (_req, res) => {
  res.render("users/login");
};

module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome Back to YelpCamp");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash("error", "Logout error");
      return next(err);
    }
  });
  req.flash("success", "Logged out");
  res.redirect("/campgrounds");
};
