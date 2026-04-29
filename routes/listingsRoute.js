const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync"); // ** (We don't need wrapAsync function if our express version is 5) **
const ExpressError = require("../utils/ExpressError");

// joi ===> schema object validation

const { listingSchema } = require("../schema");
const {
  isLogin,
  listingAuthentication,
  findCoordinates,
} = require("../middleware");
const {
  index,
  renderNewForm,
  createListing,
  showListing,
  renderEditForm,
  updateListing,
  destroyListing,
} = require("../controllers/listings");

const multer = require("multer");
const { storage } = require("../cloudConfig");

// const upload = multer({ dest: "uploads/" });
const upload = multer({ storage });

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
// create New Listing
// Add new Listing in listings

router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isLogin,
    validateListings,
    upload.single("listing[image]"),
    wrapAsync(createListing),
  );

// create New Listing form

router.route("/new").get(isLogin, renderNewForm);

// show listing
// Update List
// Delete Route

router
  .route("/:id")
  .get(wrapAsync(showListing))
  .put(
    isLogin,
    listingAuthentication,
    upload.single("listing[image]"),
    validateListings,
    wrapAsync(updateListing),
  )
  .delete(isLogin, listingAuthentication, wrapAsync(destroyListing));

// update Route

// Edit form

router
  .route("/:id/edit")
  .get(isLogin, listingAuthentication, wrapAsync(renderEditForm));

module.exports = router;
