const mongoose = require("mongoose");

// middleware untuk memberikan notifikasi error jika id tidak ditemukan
module.exports = (redirectUrl = "/") => {
  return async (req, res, next) => {
    const paramId = ["id", "place_id", "review_id"].find(
      (param) => req.params[param]
    );

    if (!paramId) {
      return next();
    }

    const id = req.params[paramId];
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error_msg", "Invalid ID / Data tidak ditemukan");
      return res.redirect(redirectUrl);
    }

    next();
  };
};
