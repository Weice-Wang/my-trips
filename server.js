// 01. IMPORT MODULE
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const methodOverride = require("method-override");
const morgan = require("morgan");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`connected to MongoDB${mongoose.connection.name}`);
});

const Trip = require("./models/trip.js");

// 02. GLOBAL VARIABLE
const app = express();

// 03. MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method-override"));
app.use(morgan("dev"));

// 04. ROUTES
//Home Route
app.get("/", async (req, res) => {
  res.render("home.ejs");
});

//Create Route
app.get("/trips/new", (req, res) => {
  res.render("trips/new.ejs");
});

app.post("/trips", async (req, res) => {
  console.log(req.body);
  req.body.haveBeenThere === "on"
    ? (req.body.haveBeenThere = true)
    : (req.body.haveBeenThere = false);
  await Trip.create(req.body);
  res.redirect("/trips");
});

// Index Route
app.get("/trips", async (req, res) => {
  const allTrips = await Trip.find();
  console.log(allTrips);
  res.render("trips/index.ejs", { trips: allTrips });
});

//Show Route
app.get("/trips/:tripId", async (req, res) => {
  const foundTrip = await Trip.findById(req.params.tripId);
  res.render("trips/show.ejs", { trip: foundTrip });
});

// 05. APP LISTENER
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
