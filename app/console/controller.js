const Console = require("./model.js");
const fs = require("fs");
const path = require("path");
const config = require("../../config.js");

// =============================================================
// ====================== GET INDEX ============================
const index = async (req, res, next) => {
  try {
    const console = await Console.find();
    return res.json(console);
  } catch (err) {
    next(err);
  }
};

// =============================================================
// ====================== GET DETAIL ===========================
const detail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const console = await Console.findById(id);
    return res.json(console);
  } catch (err) {
    next(err);
  }
};

// =============================================================
// ====================== ADD DATA =============================
const store = async (req, res, next) => {
  try {
    const payload = req.body;
    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];
      let fileName = req.file.filename + "." + originalExt;
      let target_path = path.resolve(config.rootPath, `fungamesapi/public/images/console/${fileName}`);

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);

      src.pipe(dest);

      src.on("end", async () => {
        try {
          let console = new Console({ ...payload, image_url: fileName });
          await console.save();
          return res.json(console);
        } catch (err) {
          fs.unlinkSync(target_path);
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

      src.on("error", async () => {
        next(err);
      });
    } else {
      let console = new Console(payload);
      await console.save();
      return response.json(console);
    }
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
// ====================== UPDATE DATA ==========================
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];
      let filname = req.file.filename + "." + originalExt;
      let target_path = path.resolve(config.rootPath, `fungamesapi/public/images/console/${filname}`);

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);

      src.pipe(dest);

      src.on("end", async () => {
        try {
          let console = await Console.findById(id);
          let currentImage = `${config.rootPath}/fungamesapi/public/images/console/${console.image_url}`;

          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }
          console = await Console.findByIdAndUpdate(id, { ...payload, image_url: filname }, { new: true, runValidators: true });
          return res.json(`${console.name} updated successfully`);
        } catch (err) {
          fs.unlinkSync(target_path);
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

      src.on("error", async () => {
        next(err);
      });
    } else {
      let console = await Console.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
      return res.json(`${console} updated successfully`);
    }
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
    const console = await Console.findByIdAndDelete(id);

    const currentImage = `${config.rootPath}/fungamesapi/public/images/console/${console.image_url}`;
    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }
    return res.json(`${console.name} deleted successfully`);
  } catch (err) {
    next(err);
  }
};

module.exports = { index, detail, store, update, destroy };
