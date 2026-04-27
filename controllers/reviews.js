const Listing = require("../models/listing");
const Review = require("../models/review");

// Create Review

module.exports.createReview = async (req, res) => {
  let newReview = new Review(req.body.review);

  newReview.author = req.user._id;
  let listing = await Listing.findById(req.params.id);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "Thank you! Your feedback has been recorded.");
  // req.flash("error", "Something went wrong while submitting your review.");
  res.redirect(`/listings/${listing._id}`);
};

// delete Review

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Review.findByIdAndDelete(reviewId);

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  req.flash("success", "Review deleted successfully.");
  // req.flash("error", "Failed to delete review. Please try again.");

  res.redirect(`/listings/${id}`);
};
