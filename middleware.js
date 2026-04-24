const Listing = require("./models/listing");
const Review = require("./models/review");

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

module.exports.listingAuthentication = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(req.user._id)) {
    req.flash(
      "error",
      "You are not the owner of this listing, so you cannot perform this action.",
    );
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.reviewAuthentication = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(req.user._id)) {
    req.flash(
      "error",
      "You are not the Author of this Review, so you cannot perform this action.",
    );
    return res.redirect(`/listings/${id}`);
  }
  next();
};
