const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync"); // ** (We don't need wrapAsync function if our express version is 5) **
const ExpressError = require("../utils/ExpressError");

// joi ===> schema object validation

const { reviewSchema } = require("../schema");

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

router.post(
  "/",
  // validateReview,
  wrapAsync(async (req, res) => {
    let newReview = new Review(req.body.review);

    let listing = await Listing.findById(req.params.id);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "Thank you! Your feedback has been recorded.");
    // req.flash("error", "Something went wrong while submitting your review.");
    res.redirect(`/listings/${listing._id}`);
  }),
);

// Delete review route

router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    req.flash("success", "Review deleted successfully.");
    // req.flash("error", "Failed to delete review. Please try again.");

    res.redirect(`/listings/${id}`);
  }),
);

module.exports = router;
