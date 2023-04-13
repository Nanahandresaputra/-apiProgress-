const { model, Schema } = require("mongoose");

const genreSchema = Schema({
  name: {
    type: String,
    required: [true, "name required"],
  },
});

module.exports = model("Genres", genreSchema);
