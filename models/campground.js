const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  image: String,
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
