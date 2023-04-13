const { model, Schema } = require("mongoose");

const consoleSchema = Schema({
  name: {
    type: String,
    required: [true, "name required"],
  },
  image_url: String,
});

module.exports = model("Console", consoleSchema);
