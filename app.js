const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
// const imagesRouter = require("./controllers/images");
const photos = require("./photos");

// app.use(cors);
app.use(bodyParser.json());

// app.use("/api/images", imagesRouter);

app.get("/", (req, res) => {
  res.send("<h1>Landing Page</h1>");
});

app.get("/images", (req, res) => {
  res.json(photos);
});

module.exports = app;
