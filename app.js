const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const listingsRouter = require("./routes/listingsRoute");
const reviewsRouter = require("./routes/reviewsRoute");

const cors = require("cors");
app.use(cors());

const ExpressError = require("./utils/ExpressError");

const session = require("express-session");
const flash = require("connect-flash");

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

// Use express-session package

let sessionOptions = {
  secret: "sessioncode",
  resave: true,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash()); // ** For use connect-flash package, We have to use express-session package before it **

// Flash Message Middleware

app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.get("/", (req, res) => {
  res.redirect("/listings");
});

// listings Route

app.use("/listings", listingsRouter);

// reviews Route

app.use("/listings/:id/reviews", reviewsRouter);

// Error Handling

app.use((req, res, next) => {
  next(new ExpressError(400, "Page not Found!"));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "something went wrong!" } = err;
  // res.status(status).send(message);
  res.render("error", { message });
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
