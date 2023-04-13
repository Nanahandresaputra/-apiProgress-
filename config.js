const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

module.exports = {
  rootPath: (__dirname, ".."),
  secretKey: process.env.SECRET_KEY,
  db_url: process.env.MONGODB_URI,
};
