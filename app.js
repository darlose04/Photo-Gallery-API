const express = require("express");
const app = express();
// const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-sessions");

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(error => {
    console.error("Error connecting to MongoDB: ", error);
  });

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// body parser
app.use(express.urlencoded({ extended: false }));

// express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// connect flash
app.use(flash());

// app.use(cors);
// app.use(bodyParser.json());

// Routes
app.use("/", require("./controllers/index"));
app.use("/users", require("./controllers/users"));

module.exports = app;
