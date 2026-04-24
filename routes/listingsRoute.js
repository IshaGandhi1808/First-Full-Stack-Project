const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync"); // ** (We don't need wrapAsync function if our express version is 5) **
const ExpressError = require("../utils/ExpressError");

// joi ===> schema object validation

const { listingSchema } = require("../schema");
const { isLogin, listingAuthentication } = require("../middleware");

// middleware

// listing schema validation

const validateListings = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// (Home) index page - view all Listing

router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListing = await Listing.find();
    res.render("listings/index", { allListing });
  }),
);

// create New Listing

// create New Listing form

router.get("/new", isLogin, (req, res) => {
  res.render("listings/new");
});

// Add new Listing in listings

router.post(
  "/",
  isLogin,
  validateListings,
  wrapAsync(async (req, res, next) => {
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user;
    await newListing.save();

    // req.flash("error", "Creation failed. Please try again.");
    req.flash("success", "New record added successfully!");
    res.redirect("/listings");
  }),
);

// show listing

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
      // .populate("reviews")
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Failed to load data.");
      return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
  }),
);

// update Route

// Edit form

router.get(
  "/:id/edit",
  isLogin,
  listingAuthentication,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "The item you’re trying to Edit was not found.");
      return res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
  }),
);

// Update List

router.put(
  "/:id",
  isLogin,
  listingAuthentication,
  validateListings,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // req.flash("error", "Update failed. Please try again.");
    req.flash("success", "Changes saved successfully.");

    res.redirect(`/listings/${id}`);
  }),
);

// Delete Route

router.delete(
  "/:id",
  isLogin,
  listingAuthentication,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    // req.flash("error", "Deletion failed. Please try again.");
    req.flash("success", "Deleted successfully.");
    res.redirect("/listings");
  }),
);

module.exports = router;
