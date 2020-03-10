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
const Image = require("../models/Image");

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
        const filename = file.originalname;
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
  // gfs.files.find().toArray((err, files) => {
  //   if (!files || files.length === 0) {
  //     res.render("images", { files: false });
  //   } else {
  //     files.map(file => {
  //       if (
  //         file.contentType === "image/jpeg" ||
  //         file.contentType === "image/png"
  //       ) {
  //         file.isImage = true;
  //       } else {
  //         file.isImage = false;
  //       }
  //     });
  //     res.render("images", { files: files });
  //   }
  // });

  Image.find({}, (err, images) => {
    // console.log(images);
    res.render("images", { images });
  });
});

// upload
router.post("/upload", upload.single("file"), (req, res) => {
  const { title, width, height } = req.body;

  const newImage = new Image({
    file: req.file,
    title,
    width,
    height
  });
  // console.log(newImage);
  newImage.save();

  res.redirect("/images");
});

// display files in json format
router.get("/files", (req, res) => {
  // gfs.files.find().toArray((err, files) => {
  //   if (!files || files.length === 0) {
  //     return res.status(404).json({
  //       err: "No Files Exist"
  //     });
  //   }

  Image.find((err, images) => {
    if (!images || images.length === 0) {
      return res.status(404).json({
        err: "No files exist"
      });
    }

    return res.json(images);
  });
});

// display single image
router.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No File Exists"
      });
    }

    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image"
      });
    }
  });
});

// delete file
router.delete("/files/:id", ensureAuthenticated, async (req, res) => {
  await Image.find((err, images) => {
    images.map(image => {
      if (image.id == req.params.id) {
        gfs.remove(
          { _id: image.file.id, root: "uploads" },
          (err, gridStore) => {
            if (err) {
              return res.status(404).json({
                err: err
              });
            }
          }
        );
      }
    });
  });

  await Image.findByIdAndDelete(req.params.id, err => {
    if (err) console.error(err);
  });
  res.redirect("/images");
});

module.exports = router;
