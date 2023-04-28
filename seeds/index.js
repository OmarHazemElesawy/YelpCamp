//self contained seeding file, run it to delete all data and seed it all over again
//imports
const mongoose = require("mongoose");
const cities = require("./seeds");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
const Review = require("../models/review");

// //maps seeding
// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// const mapboxToken =
//   "pk.eyJ1IjoiZ2VvLW1hcHMtY291cnNlIiwiYSI6ImNsaDBjZTNxMjBzMjczZ3FjbzUyajh0bXcifQ.FI1oZN-SrZIC11ZKR0Bk2w";
// const geocoder = mbxGeocoding({ accessToken: mapboxToken });

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
  await Review.deleteMany({});
  for (let i = 0; i < count; i++) {
    const randPrice = Math.floor(Math.random() * 25) + 10;
    const randLocation = randGen(cities);
    const location = `${randLocation.city}, ${randLocation.state}`;
    const geometry = { type: 'Point', coordinates: [randLocation.longitude, randLocation.latitude] };
    const newCampground = new Campground({
      author: "644c03d8c53712220f026e09",
      geometry,
      location,
      title: `${randGen(descriptors)}, ${randGen(places)}`,
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facilis distinctio rerum exercitationem architecto iusto eius magni maxime laboriosam ea? Minima, ipsa quidem nam perspiciatis modi tempora sapiente eos ipsam! Facilis.",
      price: randPrice,
      images: [
        {
          url: "https://res.cloudinary.com/dgglpas6e/image/upload/v1682602873/YelpCamp/lwglck0dfohphxnew1pq.jpg",
          filename: "YelpCamp/lwglck0dfohphxnew1pq",
        },
        {
          url: "https://res.cloudinary.com/dgglpas6e/image/upload/v1682602873/YelpCamp/b8guq0lob7m24cxlww4n.jpg",
          filename: "YelpCamp/b8guq0lob7m24cxlww4n",
        },
        {
          url: "https://res.cloudinary.com/dgglpas6e/image/upload/v1682602873/YelpCamp/klkrd76kurkz8qxr7pm5.jpg",
          filename: "YelpCamp/klkrd76kurkz8qxr7pm5",
        },
      ],
    });
    await newCampground.save();
  }
};

// const genGeoCode = async (location) => {
//   const geoData = await geocoder
//     .forwardGeocode({
//       query: location,
//       limit: 1,
//     })
//     .send();
//   return geoData.body.features[0].geometry;
// };

//200 entries
seedDB(200).then(() => {
  mongoose.connection.close();
});
