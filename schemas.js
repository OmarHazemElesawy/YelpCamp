const JOI = require("joi");

const campgroundSchema = JOI.object({
  campground: JOI.object({
    title: JOI.string().required(),
    location: JOI.string().required(),
    description: JOI.string().required(),
    price: JOI.number().min(0).required(),
    image: JOI.string().required(),
  }).required(),
});

module.exports.campgroundSchema = campgroundSchema;

const reviewSchema = JOI.object({
  review: JOI.object({
    rating: JOI.number().min(1).max(5).required(),
    body: JOI.string().required(),
  }).required(),
});

module.exports.reviewSchema = reviewSchema;
