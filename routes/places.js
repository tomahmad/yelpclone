const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/errorHandler");
const { placeSchema } = require("../schemas/place");
const wrapAsync = require("../utils/wrapAsync");
const PlaceController = require("../controllers/places.js");
const isValidObjectId = require("../middleware/isValidObjectId");
const isAuth = require("../middleware/isAuth.js");
const { isAuthorPlace } = require("../middleware/isAuthor.js");

const validatePlace = (req, res, next) => {
  const { error } = placeSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return next(new ErrorHandler(msg, 404));
  } else {
    next();
  }
};

router
  .route("/")
  .get(wrapAsync(PlaceController.index))
  .post(isAuth, validatePlace, wrapAsync(PlaceController.store));

router.get("/create", isAuth, (req, res) => {
  res.render("places/create");
});

router
  .route("/:id")
  .get(
    // jika id salah, akan diarahkan ke halaman /places
    isValidObjectId("/places"),
    wrapAsync(PlaceController.show)
  )
  .put(
    isAuth,
    isAuthorPlace,
    isValidObjectId("/places"),
    validatePlace,
    wrapAsync(PlaceController.update)
  )
  .delete(
    isAuth,
    isValidObjectId("/places"),
    wrapAsync(PlaceController.destroy)
  );

router.get(
  "/:id/edit",
  isAuth,
  isAuthorPlace,
  isValidObjectId("/places"),
  wrapAsync(PlaceController.edit)
);

module.exports = router;
