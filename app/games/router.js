const express = require("express");
const gamesController = require("./controller.js");
const router = express.Router();
const multer = require("multer");
const uploadFiles = require("../../middlewares/uploadFiles.js");

const uploads = multer({ storage: uploadFiles }).any();

router.get("/games", gamesController.index);
router.get("/games/:id", gamesController.detail);
router.post("/games", uploads, gamesController.store);
router.put("/games/:id", uploads, gamesController.update);
router.delete("/games/:id", gamesController.destroy);

module.exports = router;
