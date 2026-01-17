const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  activities: String,
  priceRange: {
    type: String,
    enum: ["", "0-1000", "1000-5000", "5000-10000", "10000+"],
  },
  haveBeenThere: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  trips: [tripSchema],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
