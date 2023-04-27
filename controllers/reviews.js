const Campground = require("../models/campground");
const Review = require("../models/review");

//post a new review
module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const review = new Review({ ...req.body.review });
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Successfully Created A New Review");
  res.redirect(`/campgrounds/${id}`);
};

//delete a review
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "you do not have the permission to delete this review!");
    return res.redirect(`/campgrounds/${id}`);
  }
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully Deleted Review");
  res.redirect(`/campgrounds/${id}`);
};
