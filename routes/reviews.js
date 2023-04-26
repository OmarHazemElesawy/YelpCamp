const express = require("express");

const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { reviewSchema } = require("../schemas");
const { isLoggedIn } = require("../utils/middleware");
const router = express.Router({ mergeParams: true });

//server side validate using JOI
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

//Reviews Routes
router.post(
  "/",
  validateReview,
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review({ ...req.body.review });
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Successfully Created A New Review");
    res.redirect(`/campgrounds/${id}`);
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
      req.flash(
        "error",
        "you do not have the permission to delete this review!"
      );
      return res.redirect(`/campgrounds/${id}`);
    }
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully Deleted Review");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
