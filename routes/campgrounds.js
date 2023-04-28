const express = require("express");

const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../utils/middleware");
const campgroundsController = require("../controllers/campgrounds");
const { validateCampground } = require("../utils/middleware");

//multer and cloudinary for image upload
const { cloudinary, storage } = require("../cloudinary");
const multer = require("multer");
const upload = multer({ storage });

const router = express.Router();

//campground Routes
//Index Route
router.get("/", wrapAsync(campgroundsController.index));

//New Routes
router.get("/new", isLoggedIn, campgroundsController.renderNewForm);
router.post(
  "/",
  isLoggedIn,
  upload.array("image"),
  validateCampground,
  wrapAsync(campgroundsController.createCampground)
);

//single file
// router.post("/", upload.single("image"), (req, res) => {
//   console.log(req.body, req.file);
//   res.send("it worked");
// });
// //multiple files
// router.post("/", upload.array("image"), (req, res) => {
//   console.log(req.body, req.files);
//   res.send("it worked");
// })

//Show Route
router.get("/:id", wrapAsync(campgroundsController.showCampground));

//Edit Routes
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(campgroundsController.renderEditForm)
);
router.put(
  "/:id",
  isLoggedIn,
  upload.array("image"),
  validateCampground,
  wrapAsync(campgroundsController.updateCampground)
);

//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(campgroundsController.deleteCampground)
);

module.exports = router;
