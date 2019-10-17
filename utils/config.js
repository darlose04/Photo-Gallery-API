require("dotenv").config();

let PORT = process.env.PORT;
let MONGODB_URI = process.env.MONGODB_URI;
let IMAGE_URI = process.env.IMAGE_URI;
let EMAIL = process.env.EMAIL;
let PASSWORD = process.env.PASSWORD;

if (process.env.NODE_ENV === "test") {
  MONGODB_URI = process.env.TEST_MONGODB_URI;
}

module.exports = {
  IMAGE_URI,
  MONGODB_URI,
  PORT,
  EMAIL,
  PASSWORD
};
