//self contained seeding file, run it to delete all data and seed it all over again
//imports
const mongoose = require("mongoose");
const cities = require("./seeds");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
const Review = require("../models/review");

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
    const randCity = randGen(cities);
    const newCampground = new Campground({
      author: "64490eab667efd704de8eb5d",
      location: `${randCity.city}, ${randCity.state}`,
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

//50 entries
seedDB(50).then(() => {
  mongoose.connection.close();
});
