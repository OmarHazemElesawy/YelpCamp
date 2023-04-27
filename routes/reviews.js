const express = require("express");

const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../utils/middleware");
const { validateReview } = require("../utils/middleware");
const reviewsController = require("../controllers/reviews");
const router = express.Router({ mergeParams: true });

//Reviews Routes
router.post(
  "/",
  validateReview,
  isLoggedIn,
  wrapAsync(reviewsController.createReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  wrapAsync(reviewsController.deleteReview)
);

module.exports = router;
