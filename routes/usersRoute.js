const express = require("express");
const router = express.Router();

const User = require("../models/user");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { saveOriginalUrl } = require("../middleware");
const {
  renderSignupForm,
  signup,
  renderLoginForm,
  login,
  logout,
} = require("../controllers/users");

// signup Route

// Get signup form
// post signup

router.route("/signup").get(renderSignupForm).post(wrapAsync(signup));

// login Route

// Get login form
// post login

router
  .route("/login")
  .get(renderLoginForm)
  .post(
    saveOriginalUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    wrapAsync(login),
  );

// logout route

router.route("/logout").get(logout);

module.exports = router;
