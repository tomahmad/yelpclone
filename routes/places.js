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

router.get("/", wrapAsync(PlaceController.index));

router.get("/create", isAuth, (req, res) => {
  res.render("places/create");
});

router.post("/", isAuth, validatePlace, wrapAsync(PlaceController.store));

router.get(
  "/:id",
  // jika id salah, akan diarahkan ke halaman /places
  isValidObjectId("/places"),
  wrapAsync(PlaceController.show)
);

router.get(
  "/:id/edit",
  isAuth,
  isAuthorPlace,
  isValidObjectId("/places"),
  wrapAsync(PlaceController.edit)
);

router.put(
  "/:id",
  isAuth,
  isAuthorPlace,
  isValidObjectId("/places"),
  validatePlace,
  wrapAsync(PlaceController.update)
);

router.delete(
  "/:id",
  isAuth,
  isValidObjectId("/places"),
  wrapAsync(PlaceController.destroy)
);

module.exports = router;
