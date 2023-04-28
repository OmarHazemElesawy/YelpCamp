if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//Packages imports
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const passportLocal = require("passport-local");

//file imports
const ExpressError = require("./utils/ExpressError");
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const usersRoutes = require("./routes/users");
const User = require("./models/user");

//Express
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

//Session and cookies
const sessionConfig = {
  secret: "expressSessionSecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24,
    maxAge: 1000 * 60 * 60 * 24,
    HttpOnly: true,
  },
};
app.use(session(sessionConfig));

//Flash
app.use(flash());

//Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//local storage
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//method override
app.use(methodOverride("_method"));

//Mongodb connection
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

//EJS
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));

//Home Route
app.get("/", (_req, res) => {
  res.render("home");
});

//Express Routers
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);
app.use("/", usersRoutes);

//Catch all route, passes error to error handler
app.all("*", (_req, _res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

//Error Handler
app.use((err, _req, res, _next) => {
  const { status = 500, message = "oh no something went wrong" } = err;
  res.status(status).render("error", { message: message, stack: err.stack });
});

//Connection port 3000
app.listen(3000, () => {
  console.log("listening on port 3000");
});
