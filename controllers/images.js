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

// create storage engine
const storage = new GridFsStorage({
  url: config.IMAGE_URI,
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

// loads form
router.get("/", ensureAuthenticated, (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      res.render("images", { files: false });
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

      res.render("images", { files: files });
    }
  });
});

// upload
router.post("/upload", upload.single("file"), (req, res) => {
  // res.json({ file: req.file });
  res.redirect("/");
});

router.get("/files", ensureAuthenticated, (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "No Files Exist"
      });
    }

    return res.json(files);
  });
});

module.exports = router;
