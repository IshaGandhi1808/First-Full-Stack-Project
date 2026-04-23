const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const Review = require("./models/review");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const cors = require("cors");
app.use(cors());

const wrapAsync = require("./utils/wrapAsync"); // ** (We don't need wrapAsync function if our express version is 5) **
const ExpressError = require("./utils/ExpressError");

// joi ===> schema object validation

const { listingSchema, reviewSchema } = require("./schema");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "/public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));

const MONGOOSE_URL = `mongodb://127.0.0.1:27017/wanderlust`;

main()
  .then(() => console.log(`Connetion Successful`))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGOOSE_URL);
}

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

app.get("/", (req, res) => {
  res.redirect("/listings");
});

// (Home) index page - view all Listing

app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    let allListing = await Listing.find();
    res.render("listings/index", { allListing });
  }),
);

// create New Listing

// create New Listing form

app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// Add new Listing in listings

app.post(
  "/listings",
  validateListings,
  wrapAsync(async (req, res, next) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  }),
);

// show listing

app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show", { listing });
  }),
);

// update Route

// Edit form

app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
  }),
);

// Update List

app.put(
  "/listings/:id",
  validateListings,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  }),
);

// Delete Route

app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);

// create review route

app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let newReview = new Review(req.body.review);

    let listing = await Listing.findById(req.params.id);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  }),
);

// Delete review route

app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    res.redirect(`/listings/${id}`);
  }),
);

// Error Handling

app.use((req, res, next) => {
  next(new ExpressError(400, "Page not Found!"));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "something went wrong!" } = err;
  res.status(status).send(message);
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
