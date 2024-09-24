const express = require("express");
// mergeParams dibutukan agar parameter 'place_id' yang ada di app.js, bisa digunakan di file ini (link pada method post tidak tersedia place_id)
const router = express.Router({ mergeParams: true });
const ErrorHandler = require("../utils/errorHandler");
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review");
const Place = require("../models/place");
const { reviewSchema } = require("../schemas/review");
const isValidObjectId = require("../middleware/isValidObjectId");
const isAuth = require("../middleware/isAuth");
const { isAuthorReview } = require("../middleware/isAuthor");

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
  wrapAsync(async (req, res) => {
    const { place_id } = req.params;
    const review = new Review(req.body.review);
    review.author = req.user._id;
    await review.save();

    const place = await Place.findById(place_id);
    place.reviews.push(review);
    await place.save();

    req.flash("success_msg", "Review added successfully");
    res.redirect(`/places/${place_id}`);
  })
);

router.delete(
  "/:review_id",
  isAuth,
  isAuthorReview,
  isValidObjectId("/places"),
  wrapAsync(async (req, res) => {
    const { place_id, review_id } = req.params;
    await Place.findByIdAndUpdate(place_id, {
      $pull: { reviews: review_id },
    });
    await Review.findOneAndDelete(review_id);
    req.flash("success_msg", "Review deleted successfully");
    res.redirect(`/places/${place_id}`);
  })
);

module.exports = router;
