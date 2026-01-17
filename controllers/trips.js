const express = require("express");
const router = express.Router();

const User = require("../models/user.js");

// Index Route
router.get("/", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    res.render("trips/index.ejs", { trips: currentUser.trips });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

//Create New Route
router.get("/new", (req, res) => {
  res.render("trips/new.ejs", { user: req.session.user });
});

router.post("/", async (req, res) => {
  try {
    req.body.haveBeenThere = req.body.haveBeenThere === "on";
    const currentUser = await User.findById(req.session.user._id);
    currentUser.trips.push(req.body);
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/trips`);
  } catch (error) {
    // If any errors, log them and redirect back home
    console.log(error);
    res.redirect("/");
  }
});

//Show Route
router.get("/:tripId", async (req, res) => {
  try {
    console.log(req.params);
    const currentUser = await User.findById(req.session.user._id);
    const trip = currentUser.trips.id(req.params.tripId);
    res.render("trips/show.ejs", { trip: trip });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

//Delete Route
router.delete("/:tripId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.trips.id(req.params.tripId).deleteOne();
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/trips`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

//Edit Route
router.get("/:tripId/edit", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const trip = currentUser.trips.id(req.params.tripId);
    res.render(`trips/edit.ejs`, { trip: trip });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.put("/:tripId", async (req, res) => {
  try {
    if (req.body.haveBeenThere === "on") {
      req.body.haveBeenThere = true;
    } else {
      req.body.haveBeenThere = false;
    }
    const currentUser = await User.findById(req.session.user._id);
    const trip = currentUser.trips.id(req.params.tripId);
    trip.set(req.body);
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/trips/${req.params.tripId}`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
