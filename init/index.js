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
  let listings = await Listing.insertMany(initData.data);
  console.log(listings);
};

addListing();
