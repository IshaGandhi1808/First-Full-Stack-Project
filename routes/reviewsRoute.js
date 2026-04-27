const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync"); // ** (We don't need wrapAsync function if our express version is 5) **
const ExpressError = require("../utils/ExpressError");

// joi ===> schema object validation

const { reviewSchema } = require("../schema");
const { isLogin, reviewAuthentication } = require("../middleware");
const { createReview, destroyReview } = require("../controllers/reviews");

// Review Schema validation Middleware

const validateReview = async (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// create review route

router.post("/", isLogin, validateReview, wrapAsync(createReview));

// Delete review route

router.delete(
  "/:reviewId",
  isLogin,
  reviewAuthentication,
  wrapAsync(destroyReview),
);

module.exports = router;
