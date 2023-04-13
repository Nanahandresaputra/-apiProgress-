const express = require("express");
const router = express.Router();
const multer = require("multer");
const os = require("os");
const consoleController = require("./controller.js");

const destination = multer({ dest: os.tmpdir() }).single("image_url");

router.get("/console", consoleController.index);
router.get("/console/:id", consoleController.detail);
router.post("/console", destination, consoleController.store);
router.put("/console/:id", destination, consoleController.update);
router.delete("/console/:id", consoleController.destroy);

module.exports = router;
