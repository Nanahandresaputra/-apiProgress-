const Genres = require("./model.js");

// =============================================================
// ====================== GET INDEX ============================
const index = async (req, res, next) => {
  try {
    const genres = await Genres.find();
    return res.json(genres);
  } catch (err) {
    next(err);
  }
};

// =============================================================
// ====================== GET DETAIL ===========================
const detail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const genres = await Genres.findById(id);
    return res.json(genres);
  } catch (err) {
    next(err);
  }
};

// =============================================================
// ====================== ADD DATA =============================
const store = async (req, res, next) => {
  try {
    const payload = req.body;
    const genres = new Genres(payload);
    await genres.save();
    return res.json(genres);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

// =============================================================
// ====================== UPADTE DATA ==========================
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const genres = await Genres.findByIdAndUpdate(id, payload);
    return res.json(`${genres.name} updated successfully`);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

// =============================================================
// ====================== DELETE DATA ==========================
const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const genres = await Genres.findByIdAndDelete(id);
    return res.json(`${genres.name} deleted successfully`);
  } catch (err) {
    next(err);
  }
};

module.exports = { index, detail, store, update, destroy };
