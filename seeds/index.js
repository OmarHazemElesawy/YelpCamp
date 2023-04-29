//self contained seeding file, run it to delete all data and seed it all over again
//imports
require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const cities = require("./seeds");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
const Review = require("../models/review");

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
    const randLocation = randGen(cities);
    const location = `${randLocation.city}, ${randLocation.state}`;
    const geometry = { type: 'Point', coordinates: [randLocation.longitude, randLocation.latitude] };
    const newCampground = new Campground({
      author: process.env.ADMIN_ID,
      geometry,
      location,
      title: `${randGen(descriptors)}, ${randGen(places)}`,
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facilis distinctio rerum exercitationem architecto iusto eius magni maxime laboriosam ea? Minima, ipsa quidem nam perspiciatis modi tempora sapiente eos ipsam! Facilis. Cupiditate ex debitis, voluptas nobis rem veritatis.",
      price: randPrice,
      images: [
        {
          url: "https://res.cloudinary.com/dgglpas6e/image/upload/v1682760987/YelpCamp/mzqkkps9ii1t0zs3q8xt.jpg",
          filename: "YelpCamp/mzqkkps9ii1t0zs3q8xt",
        },
        {
          url: "https://res.cloudinary.com/dgglpas6e/image/upload/v1682760987/YelpCamp/zynftiygq4awonhugr0r.jpg",
          filename: "YelpCamp/zynftiygq4awonhugr0r",
        },
        {
          url: "https://res.cloudinary.com/dgglpas6e/image/upload/v1682760987/YelpCamp/pu3htksr386kfntvpg6l.jpg",
          filename: "YelpCamp/pu3htksr386kfntvpg6l",
        },
      ],
    });
    await newCampground.save();
  }
};

//200 entries
seedDB(200).then(() => {
  mongoose.connection.close();
});