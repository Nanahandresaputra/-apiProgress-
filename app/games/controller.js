const Games = require("./model.js");
const Genres = require("../genres/model.js");
const config = require("../../config.js");
const fs = require("fs");
const path = require("path");

// =============================================================
// ====================== GET INDEX ============================
const index = async (req, res, next) => {
  try {
    const games = await Games.find().populate("genre").select("-__v");
    const count = await Games.find().countDocuments();
    return res.json({ games, count });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// ====================== GET DETAIL ===========================
const detail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const games = await Games.findById(id).populate("genre").select("-__v");
    return res.json(games);
  } catch (error) {
    next(error);
  }
  next();
};

// =============================================================
// ====================== ADD DATA =============================
const store = async (req, res, next) => {
  try {
    let payload = req.body;
    if (payload.genre && payload.genre.length > 0) {
      let genres = await Genres.find({ name: { $in: payload.genre } });
      if (genres.length) {
        payload = { ...payload, genre: genres.map((index) => index._id) };
      } else {
        delete payload.genres;
      }
    }
    if (req.files) {
      let tmp_path_img = req.files[0].path;
      let tmp_path_ptr = req.files[1].path;
      let imageUrlName = req.files[0].filename;
      let posterUrlName = req.files[1].filename;
      let target_path1 = path.resolve(config.rootPath, `fungamesapi/public/images/games/${imageUrlName}`);
      let target_path2 = path.resolve(config.rootPath, `fungamesapi/public/images/games/${posterUrlName}`);

      let src = fs.createReadStream(tmp_path_img);
      let src1 = fs.createReadStream(tmp_path_ptr);
      const dest1 = fs.createWriteStream(target_path1);
      const dest2 = fs.createWriteStream(target_path2);

      // =============================================
      // ===============SRC1==========================
      src.pipe(dest1);
      src.on("end", () => {
        console.log("add data");
      });
      src.on("error", async () => {
        next(err);
      });

      // =============================================
      // ===============SRC2==========================
      src1.pipe(dest2);
      src1.on("end", async () => {
        try {
          let games = new Games({ ...payload, image_url: imageUrlName, poster_url: posterUrlName });
          await games.save();
          return res.json(games);
        } catch (err) {
          fs.unlinkSync(target_path1);
          fs.unlinkSync(target_path2);
          if (err && err.name === "ValidationError") {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
        }
      });
      src1.on("error", async () => {
        next(err);
      });
      // ========================================
    } else {
      if (payload.genre && payload.genre.length > 0) {
        let genres = await Genres.find({ name: { $in: payload.genre } });
        if (genres.length) {
          payload = { ...payload, genre: genres.map((index) => index._id) };
        } else {
          delete payload.genres;
        }
      }
      let games = new Games(payload);
      await games.save();
      return res.json(games);
    }
  } catch (err) {
    if (err && err.name === "ValidationError") {
      res.json({
        error: 1,
        message: err.message,
        fields: err.error,
      });
    }
    next(err);
  }
};

// =============================================================
// ====================== UPADTE DATA ==========================
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    let payload = req.body;

    if (payload.genre && payload.genre.length > 0) {
      let genres = await Genres.find({ name: { $in: payload.genre } });
      if (genres.length) {
        payload = { ...payload, genre: genres.map((index) => index._id) };
      } else {
        delete payload.genres;
      }
    }

    if (req.files) {
      let tmp_path_img = req.files[0].path;
      let tmp_path_ptr = req.files[1].path;
      let imageUrlName = req.files[0].filename;
      let posterUrlName = req.files[1].filename;
      let target_path1 = path.resolve(config.rootPath, `fungamesapi/public/images/games/${imageUrlName}`);
      let target_path2 = path.resolve(config.rootPath, `fungamesapi/public/images/games/${posterUrlName}`);

      let src = fs.createReadStream(tmp_path_img);
      let src1 = fs.createReadStream(tmp_path_ptr);
      const dest1 = fs.createWriteStream(target_path1);
      const dest2 = fs.createWriteStream(target_path2);

      // =============================================
      // ===============SRC1==========================
      src.pipe(dest1);
      src.on("end", () => {
        console.log("update data");
      });
      src.on("error", async () => {
        next(err);
      });

      // =============================================
      // ===============SRC2==========================
      src1.pipe(dest2);
      src1.on("end", async () => {
        try {
          let games = await Games.findById(id);
          let currentImage = `${config.rootPath}/fungamesapi/public/images/games/${games.image_url}`;
          let currentPoster = `${config.rootPath}/fungamesapi/public/images/games/${games.poster_url}`;
          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }
          if (fs.existsSync(currentPoster)) {
            fs.unlinkSync(currentPoster);
          }
          games = await Games.findByIdAndUpdate(id, { ...payload, image_url: imageUrlName, poster_url: posterUrlName }, { new: true, runValidators: true });
          return res.json({ games, message: "Success updating" });
        } catch (err) {
          fs.unlinkSync(target_path1);
          fs.unlinkSync(target_path2);
          if (err && err.name === "ValidationError") {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
        }
      });
      src1.on("error", async () => {
        next(err);
      });
      // ========================================
    } else {
      const games = await Games.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
      return res.json({ games, message: "Success updating" });
    }
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.error,
      });
    } else {
      next(err);
    }
  }
};

// =============================================================
// ====================== DELETE DATA ==========================
const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const games = await Games.findByIdAndDelete(id);
    let currentImage = `${config.rootPath}/fungamesapi/public/images/games/${games.image_url}`;
    let currentPoster = `${config.rootPath}/fungamesapi/public/images/games/${games.poster_url}`;
    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }
    if (fs.existsSync(currentPoster)) {
      fs.unlinkSync(currentPoster);
    }
    return res.json(`${games.name} deleted successfully`);
  } catch (err) {
    next(err);
  }
};

module.exports = { index, store, update, destroy, detail };
