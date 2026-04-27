const User = require("../models/user");

// Signup Form

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup");
};

// Signup

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    //   const user = new User({
    //     username: username,
    //     email: email,
    //   });

    const user = new User({ username, email });

    const newUser = await User.register(user, password);

    // Direct Login after Signup

    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// Login Form

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

// Login

module.exports.login = async (req, res) => {
  req.flash("success", "Login successful! Welcome back to Wanderlust!");

  let originalUrl = res.locals.originalUrl || "/listings";

  if (originalUrl.includes("/reviews")) {
    let lastIndex = originalUrl.indexOf("/reviews");
    originalUrl = originalUrl.slice(0, lastIndex);
  }

  res.redirect(originalUrl);
};

// Logout

module.exports.logout = async (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You’ve been logged out of Wanderlust.");
    res.redirect("/login");
  });
};
