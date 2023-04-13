const express = require("express");
const db = require("./database/db.js");
const app = express();
const logger = require("morgan");
const cors = require("cors");
const gamesRouter = require("./app/games/router.js");
const genresRouter = require("./app/genres/router.js");
const consoleRouter = require("./app/console/router.js");
const path = require("path");

// =============================================================
// ====================== MIDDLEWARES ==========================
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(cors());
// ----------display image--------
app.use(express.static(path.join(__dirname, "public")));
// -------------------------------

// =============================================================
// ====================== HOMEPAGE =============================
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("index");
});

// =============================================================
// ====================== ROUTER ===============================
app.use("/api", gamesRouter);
app.use("/api", genresRouter);
app.use("/api", consoleRouter);

// ==========================================================
// ====================== NOT FOUND =========================
app.use("/", (req, res) => {
  res.status(404);
  res.send(`<h3>404 not found</h3>`);
});

// ==========================================================
// ====================== LISTENING PORT ====================
app.listen(8000, () => {
  console.log("listening on http://localhost:8000");
});
