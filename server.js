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
const session = require("express-session");
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

// 02. GLOBAL VARIABLE
const app = express();
const port = process.env.PORT ? process.env.PORT : "3000";
const authController = require("./controllers/auth.js");
const tripsController = require("./controllers/trips.js");

// 03. MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passUserToView);
app.use("/auth", authController);
app.get("/", async (req, res) => {
  if (req.session.user) {
    res.redirect(`/users/${req.session.user._id}/trips`);
  } else {
    res.render("home.ejs");
  }
});
app.use(isSignedIn);
app.use("/users/:userId/trips", tripsController);

// 04. HOME ROUTES

// 05. APP LISTENER
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
