//Packages imports
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");

//Files imports
const Campground = require("./models/campground");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const wrapAsync = require("./utils/wrapAsync");
const { campgroundSchema, reviewSchema } = require("./schemas");

//Express
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//method override
app.use(methodOverride("_method"));

//Mongodb connection
mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://127.0.0.1:27017/yelpCamp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });

//EJS
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));

//server side validate using JOI
//campground validation
const validateCampground = (req, _res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
//review validation
const validateReview = (req, _res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//Home Route
app.get("/", (_req, res) => {
  res.render("home");
});

//Index Route
app.get(
  "/campgrounds",
  wrapAsync(async (_req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

//New Routes
app.get("/campgrounds/new", (_req, res) => {
  res.render("campgrounds/new");
});
app.post(
  "/campgrounds",
  validateCampground,
  wrapAsync(async (req, res) => {
    const { campground } = req.body;
    const newCampground = new Campground(campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);

//Show Route
app.get(
  "/campgrounds/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    res.render("campgrounds/show", { campground });
  })
);

//Edit Routes
app.get(
  "/campgrounds/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);
app.put(
  "/campgrounds/:id",
  validateCampground,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//Delete Route
app.delete(
  "/campgrounds/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
  })
);

/////////////////////
//Reviews Routes////
app.post(
  "/campgrounds/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review({ ...req.body.review });
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${id}`);
  })
);

app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull : {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);

//Catch all route, passes error to error handler
app.all("*", (_req, _res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

//Error Handler
app.use((err, _req, res, _next) => {
  const { status = 500, message = "oh no something went wrong" } = err;
  res.status(status).render("error", { message: message, stack: err.stack });
});

//Connection port 3000
app.listen(3000, () => {
  console.log("listening on port 3000");
});
