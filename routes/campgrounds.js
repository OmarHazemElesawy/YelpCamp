const express = require("express");

const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../utils/middleware");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas");

const router = express.Router();

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

//campground routers
//Index Route
router.get(
  "/",
  wrapAsync(async (_req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

//New Routes
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  wrapAsync(async (req, res) => {
    const { campground } = req.body;
    const newCampground = new Campground(campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash("success", "Successfully Created A New Campground");
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);

//Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    //populates the authors for reviews and authors of camogrounds
    const campground = await Campground.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    if (!campground) {
      req.flash("error", "Cannot Find Requested Campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

//Edit Routes
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Cannot Find Requested Campground");
      return res.redirect("/campgrounds");
    }
    if (!campground.author.equals(req.user._id)) {
      req.flash(
        "error",
        "you do not have the permission to edit this campground!"
      );
      return res.redirect(`/campgrounds/${campground._id}`);
    }
    res.render("campgrounds/edit", { campground });
  })
);
router.put(
  "/:id",
  isLoggedIn,
  validateCampground,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
      req.flash(
        "error",
        "you do not have the permission to edit this campground!"
      );
      return res.redirect(`/campgrounds/${campground._id}`);
    } else {
      const camp = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
      });
      req.flash("success", "Successfully Updated Campground");
      res.redirect(`/campgrounds/${camp._id}`);
    }
  })
);

//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
      req.flash(
        "error",
        "you do not have the permission to edit this campground!"
      );
      return res.redirect(`/campgrounds/${campground._id}`);
    } else {
      await Campground.findByIdAndDelete(id);
      req.flash("success", "Successfully Deleted Campground");
      res.redirect(`/campgrounds`);
    }
  })
);

module.exports = router;
