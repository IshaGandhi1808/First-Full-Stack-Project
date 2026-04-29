const Listing = require("../models/listing");

// index

module.exports.index = async (req, res) => {
  let allListing = await Listing.find();
  res.render("listings/index", { allListing });
};

//Create New Listing form

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

// Create New Listing

module.exports.createListing = async (req, res, next) => {
  let location = req.body.listing.location;

  let URL = `https://nominatim.openstreetmap.org/search?q=${location}&format=geojson&limit=1`;
  let response = await fetch(URL, {
    headers: {
      "User-Agent": "wanderlust",
    },
  });

  let data = await response.json();

  if (data.features.length === 0) {
    req.flash("error", "Please enter a valid location to proceed.");
    return res.redirect(`/listings/new`);
  }

  let result = data.features[0].geometry;

  const url = req.file.path;
  const filename = req.file.filename;

  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  newListing.image = { url, filename };

  // newListing.image.url = newListing.image.url.replace(
  //   "upload/",
  //   "upload/w_600/f_auto/",
  // );

  newListing.geometry = result;

  let newdata = await newListing.save();

  // req.flash("error", "Creation failed. Please try again.");
  req.flash("success", "New record added successfully!");
  res.redirect("/listings");
};

// show listing

module.exports.showListing = async (req, res) => {
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
};

// Edit Listing Form

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  let imagePath = listing.image.url;
  let newImage = imagePath.replace("upload/", "upload/h_150,w_150/f_auto/");
  if (!listing) {
    req.flash("error", "The item you’re trying to Edit was not found.");
    return res.redirect("/listings");
  }
  res.render("listings/edit", { listing, newImage });
};

// update listing

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let location = req.body.listing.location;

  let URL = `https://nominatim.openstreetmap.org/search?q=${location}&format=geojson&limit=1`;
  let response = await fetch(URL, {
    headers: {
      "User-Agent": "wanderlust",
    },
  });

  let data = await response.json();

  if (data.features.length === 0) {
    req.flash("error", "Please enter a valid location to proceed.");
    return res.redirect(`/listings/${id}/edit`);
  }

  let result = data.features[0].geometry;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file != "undefined") {
    // if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  // }

  listing.geometry = result;
  await listing.save();

  // req.flash("error", "Update failed. Please try again.");
  req.flash("success", "Changes saved successfully.");

  res.redirect(`/listings/${id}`);
};

// delete listing

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  // req.flash("error", "Deletion failed. Please try again.");
  req.flash("success", "Deleted successfully.");
  res.redirect("/listings");
};
