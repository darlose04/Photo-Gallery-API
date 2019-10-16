const express = require("express");
const router = require("express").Router();
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const config = require("../utils/config");
const { ensureAuthenticated } = require("../utils/auth");

// mongo connection for image uploading
const conn = mongoose.createConnection(config.MONGODB_URI);

// init variable for gridfs stream
let gfs;

conn.once("open", () => {
  // initialize the stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

// create storage engine
const storage = new GridFsStorage({
  url: config.MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }

        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

// load forms
router.get("/", ensureAuthenticated, (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // check if files exist
    if (!files || files.length === 0) {
      res.render("index", { files: false });
    } else {
      files.map(file => {
        if (
          file.contentType === "image/jpeg" ||
          file.contentType === "image/png"
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });

      res.render("index", { files: files });
    }
  });
});

// upload images
router.post(
  "/upload",
  ensureAuthenticated,
  upload.single("file"),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;
