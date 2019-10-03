const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");

app.use(cors);
app.use(bodyParser.json());

module.exports = app;
