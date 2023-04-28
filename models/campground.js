const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const opts = { toJSON: { virtuals: true } };
const CampgroundSchema = new Schema(
  {
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    images: [
      {
        url: String,
        filename: String,
      },
    ],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  opts
);

//added virtual for cluster map popup text
CampgroundSchema.virtual("properties").get(function () {
  return {
    id: this._id,
    title: this.title,
  };
});

//mongoose middleware to delete all reviews related to the deleted campground
CampgroundSchema.post("findOneAndDelete", async (document) => {
  if (document) {
    await Review.deleteMany({
      _id: {
        $in: document.reviews,
      },
    });
  }
});
module.exports = mongoose.model("Campground", CampgroundSchema);
