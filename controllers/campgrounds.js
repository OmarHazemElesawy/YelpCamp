const Campground = require("../models/campground");
//mapbox setup
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAP_KEY;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

//get all campgrounds
module.exports.index = async (_req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

//get new campground form
module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};
//post new campground
module.exports.createCampground = async (req, res) => {
  const { campground } = req.body;
  const geoData  = await geocoder.forwardGeocode({
    query: campground.location,
    limit: 1,
  }).send()
  const newCampground = new Campground(campground);
  newCampground.geometry = geoData.body.features[0].geometry;
  newCampground.author = req.user._id;
  newCampground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  await newCampground.save();
  req.flash("success", "Successfully Created A New Campground");
  res.redirect(`/campgrounds/${newCampground._id}`);
};

//show specific campground
module.exports.showCampground = async (req, res) => {
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
};

//get edit campground form
module.exports.renderEditForm = async (req, res) => {
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
};
//put edited campground
module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  console.log(req.body);
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
    //add new images uploaded
    const newImages = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    camp.images.push(...newImages);
    await camp.save();
    //Pulls element from an array
    if (req.body.deletedImages) {
      await camp.updateOne({
        $pull: { images: { filename: { $in: req.body.deletedImages } } },
      });
    }
    req.flash("success", "Successfully Updated Campground");
    res.redirect(`/campgrounds/${camp._id}`);
  }
};

//delete campground
module.exports.deleteCampground = async (req, res) => {
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
};
