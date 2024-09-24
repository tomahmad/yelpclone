const express = require("express");
// mergeParams dibutukan agar parameter 'place_id' yang ada di app.js, bisa digunakan di file ini (link pada method post tidak tersedia place_id)
const router = express.Router({ mergeParams: true });
const ErrorHandler = require("../utils/errorHandler");
const wrapAsync = require("../utils/wrapAsync");
const { reviewSchema } = require("../schemas/review");
const isValidObjectId = require("../middleware/isValidObjectId");
const isAuth = require("../middleware/isAuth");
const { isAuthorReview } = require("../middleware/isAuthor");
const ReviewController = require('../controllers/reviews')

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return next(new ErrorHandler(msg, 400));
  } else {
    next();
  }
};

router.post(
  "/",
  isAuth,
  isValidObjectId("/places"),
  validateReview,
  wrapAsync(ReviewController.store)
);

router.delete(
  "/:review_id",
  isAuth,
  isAuthorReview,
  isValidObjectId("/places"),
  wrapAsync(ReviewController.destroy)
);

module.exports = router;
