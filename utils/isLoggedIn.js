module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must login first");
    return res.redirect("/login");
  }
  next();
};
