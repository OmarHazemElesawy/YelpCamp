//self contained seeding file, run it to delete all data and seed it all over again
//imports
require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const cities = require("./seeds");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
const Review = require("../models/review");
const imagesArr = require("./ImgUrls");
const descs = require("./descArr");

//mongodb connection
const dbUrl = process.env.DB_URL;
mongoose.set("strictQuery", true);
mongoose
  .connect(dbUrl, {
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
  await Review.deleteMany({});
  for (let i = 0; i < count; i++) {
    const randPrice = Math.floor(Math.random() * 25) + 10;
    const randImg1 = Math.floor(Math.random() * 20);
    const randImg2 = Math.abs(randImg1 - 19);
    const randDesc = Math.floor(Math.random() * 40);
    const randLocation = randGen(cities);
    const location = `${randLocation.city}, ${randLocation.state}`;
    const geometry = {
      type: "Point",
      coordinates: [randLocation.longitude, randLocation.latitude],
    };
    const newCampground = new Campground({
      author: process.env.ADMIN_ID,
      geometry,
      location,
      title: `${randGen(descriptors)}, ${randGen(places)}`,
      description: descs[randDesc],
      price: randPrice,
      images: [imagesArr[randImg1], imagesArr[randImg2]],
    });
    await newCampground.save();
  }
};

//50 entries
seedDB(50).then(() => {
  mongoose.connection.close();
});
