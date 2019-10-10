const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
// const imagesRouter = require("./controllers/images");
// const photos = require("./photos");

// app.use(cors);
app.use(bodyParser.json());

// Routes
app.use("/", require("./controllers/index"));
app.use("/users", require("./controllers/users"));

module.exports = app;
