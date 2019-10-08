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

app.get("/", (req, res) => {
  res.send("<h1>Landing Page</h1>");
});

module.exports = app;
