const mongoose = require("mongoose");
const { db_url } = require("../config.js");

const conectDb = mongoose.connect(db_url);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:  "));
db.once("open", () => console.log("database connected"));

module.exports = conectDb;
