const express = require("express");
const router = express.Router();

const User = require("../models/user");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { saveOriginalUrl } = require("../middleware");

// signup Route

// Get signup form

router.get("/signup", (req, res) => {
  res.render("users/signup");
});

// post signup

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
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
  }),
);

// login Route

// Get login form

router.get("/login", (req, res) => {
  res.render("users/login");
});

// post login

router.post(
  "/login",
  saveOriginalUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  wrapAsync(async (req, res) => {
    req.flash("success", "Login successful! Welcome back to Wanderlust!");

    let originalUrl = res.locals.originalUrl || "/listings";

    if (originalUrl.includes("/reviews")) {
      let lastIndex = originalUrl.indexOf("/reviews");
      originalUrl = originalUrl.slice(0, lastIndex);
    }

    res.redirect(originalUrl);
  }),
);

// logout route

router.get("/logout", async (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You’ve been logged out of Wanderlust.");
    res.redirect("/login");
  });
});

module.exports = router;
