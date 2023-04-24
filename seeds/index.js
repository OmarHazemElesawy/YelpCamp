//self contained seeding file, run it to delete all data and seed it all over again
//imports
const mongoose = require("mongoose");
const cities = require("./seeds");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

//mongodb connection
mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://127.0.0.1:27017/yelpCamp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });
// seeding functions
const randGen = (arr) => arr[Math.floor(Math.random() * arr.length)];
const seedDB = async (count) => {
  await Campground.deleteMany({});
  for (let i = 0; i < count; i++) {
    const randCity = randGen(cities);
    const newCampground = new Campground({
      location: `${randCity.city}, ${randCity.state}`,
      title: `${randGen(descriptors)}, ${randGen(places)}`,
    });
    await newCampground.save();
  }
};

//50 entries
seedDB(50).then(() => {
  mongoose.connection.close();
});