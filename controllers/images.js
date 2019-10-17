const express = require("express");
const router = express.Router();
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const { ensureAuthenticated } = require("../utils/auth");
const config = require("../utils/config");

const conn = mongoose.createConnection(config.IMAGE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// init grid fs stream
let gfs;

conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

module.exports = router;
