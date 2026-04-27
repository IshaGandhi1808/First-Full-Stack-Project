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

router.get("/signup", renderSignupForm);

// post signup

router.post("/signup", wrapAsync(signup));

// login Route

// Get login form

router.get("/login", renderLoginForm);

// post login

router.post(
  "/login",
  saveOriginalUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  wrapAsync(login),
);

// logout route

router.get("/logout", logout);

module.exports = router;
