module.exports.isLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.originalUrl = req.originalUrl;

    req.flash("error", "You are not logged in. Please log in to proceed.");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveOriginalUrl = (req, res, next) => {
  res.locals.originalUrl = req.session.originalUrl;
  next();
};
