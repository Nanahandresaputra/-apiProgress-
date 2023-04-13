const multer = require("multer");
const os = require("os");
const { uuid } = require("uuidv4");
const path = require("path");

const uploadFiles = multer.diskStorage({
  destination: os.tmpdir(),
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + uuid() + path.extname(file.originalname));
  },
});

module.exports = uploadFiles;
