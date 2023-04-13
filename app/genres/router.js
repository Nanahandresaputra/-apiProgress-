const express = require("express");
const router = express.Router();
const genresController = require("./controller.js");

router.get("/genres", genresController.index);
router.get("/genres/:id", genresController.detail);
router.post("/genres", genresController.store);
router.put("/genres/:id", genresController.update);
router.delete("/genres/:id", genresController.destroy);

module.exports = router;
