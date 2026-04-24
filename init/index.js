const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

const MONGOOSE_URL = `mongodb://127.0.0.1:27017/wanderlust`;

main()
  .then(() => console.log(`Connection Successful`))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGOOSE_URL);
}

const addListing = async () => {
  await Listing.deleteMany({});

  // ** Add listing owner using JS **

  // initData.data = initData.data.map((listing) => ({
  //   ...listing,
  //   owner: "69eb6a8af7b8513b79aec841",
  // }));

  let listings = await Listing.insertMany(initData.data);

  // ** Add listing owner using mongoose query **

  let newListings = await Listing.updateMany(
    {},
    { owner: "69eb6a8af7b8513b79aec841" },
  );
  console.log(newListings);
};

addListing();
