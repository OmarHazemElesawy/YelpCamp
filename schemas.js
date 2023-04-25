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

module.exports = campgroundSchema;
