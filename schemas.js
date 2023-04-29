const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const JOI = BaseJoi.extend(extension);

const campgroundSchema = JOI.object({
  campground: JOI.object({
    title: JOI.string().required().escapeHTML(),
    location: JOI.string().required().escapeHTML(),
    description: JOI.string().required().escapeHTML(),
    price: JOI.number().min(0).required(),
  }).required(),
  //added deleted images array to joi
  deletedImages: JOI.array(),
});

module.exports.campgroundSchema = campgroundSchema;

const reviewSchema = JOI.object({
  review: JOI.object({
    rating: JOI.number().min(0).max(5).required(),
    body: JOI.string().required().escapeHTML(),
  }).required(),
});

module.exports.reviewSchema = reviewSchema;
