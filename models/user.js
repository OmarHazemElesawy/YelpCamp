const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});
//add username and password and makes user name unique
UserSchema.plugin(passportLocalMongoose);

module.exports = new mongoose.model("User", UserSchema);
