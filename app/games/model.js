const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const gamesSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "name required"],
    },
    poster_url: String,
    image_url: String,
    description: {
      type: String,
      required: [true, "description required"],
    },
    genre: [
      {
        type: Schema.Types.ObjectId,
        ref: "Genres",
        required: [true, "genre required"],
      },
    ],
    console: String,
  },
  { timestamps: true }
);

module.exports = model("Games", gamesSchema);
