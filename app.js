const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const expressLayouts = require("express-ejs-layouts");

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// app.use(cors);
app.use(bodyParser.json());

// Routes
// app.use("/", require("./controllers/index"));
app.use("/users", require("./controllers/users"));

module.exports = app;
