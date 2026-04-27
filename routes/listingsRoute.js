const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync"); // ** (We don't need wrapAsync function if our express version is 5) **
const ExpressError = require("../utils/ExpressError");

// joi ===> schema object validation

const { listingSchema } = require("../schema");
const { isLogin, listingAuthentication } = require("../middleware");
const {
  index,
  renderNewForm,
  createListing,
  showListing,
  renderEditForm,
  updateListing,
  destroyListing,
} = require("../controllers/listings");

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

router.get("/", wrapAsync(index));

// create New Listing

// create New Listing form

router.get("/new", isLogin, renderNewForm);

// Add new Listing in listings

router.post("/", isLogin, validateListings, wrapAsync(createListing));

// show listing

router.get("/:id", wrapAsync(showListing));

// update Route

// Edit form

router.get(
  "/:id/edit",
  isLogin,
  listingAuthentication,
  wrapAsync(renderEditForm),
);

// Update List

router.put(
  "/:id",
  isLogin,
  listingAuthentication,
  validateListings,
  wrapAsync(updateListing),
);

// Delete Route

router.delete(
  "/:id",
  isLogin,
  listingAuthentication,
  wrapAsync(destroyListing),
);

module.exports = router;
