const express = require("express");
// mergeParams dibutukan agar parameter 'place_id' yang ada di app.js, bisa digunakan di file ini (link pada method post tidak tersedia place_id)
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const isValidObjectId = require("../middleware/isValidObjectId");
const isAuth = require("../middleware/isAuth");
const { isAuthorReview } = require("../middleware/isAuthor");
const ReviewController = require("../controllers/reviews");
const { validateReview } = require("../middleware/validator");

router.post("/", isAuth, isValidObjectId("/places"), validateReview, wrapAsync(ReviewController.store));

router.delete("/:review_id", isAuth, isAuthorReview, isValidObjectId("/places"), wrapAsync(ReviewController.destroy));

module.exports = router;
