//imports
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const Campground = require("./models/campground");

//Express
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//method override
app.use(methodOverride("_method"));

//mongodb connection
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

//Home route
app.get("/", (_req, res) => {
  res.render("home");
});

//Index route
app.get("/campgrounds", async (_req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

//New Routes
app.get("/campgrounds/new", (_req, res) => {
  res.render("campgrounds/new");
});
app.post("/campgrounds", async (req, res) => {
  const { campground } = req.body;
  const newCampground = new Campground(campground);
  await newCampground.save();
  res.redirect(`/campgrounds/${newCampground._id}`);
});

//Show Route
app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/show", { campground });
});

//Edit routes
app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
});
app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
});

//Delete route
app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
  res.redirect(`/campgrounds`);
});

//connection port 3000
app.listen(3000, () => {
  console.log("listening on port 3000");
});
