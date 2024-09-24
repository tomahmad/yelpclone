const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/errorHandler");
const { placeSchema } = require("../schemas/place");
const wrapAsync = require("../utils/wrapAsync");
const Place = require("../models/place");
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

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const places = await Place.find();
    res.render("places/index", { places });
  })
);

router.get("/create", isAuth, (req, res) => {
  res.render("places/create");
});

router.post(
  "/",
  isAuth,
  validatePlace,
  wrapAsync(async (req, res, next) => {
    const place = new Place(req.body.place);
    await place.save();
    req.flash("success_msg", "Place added successfully");
    res.redirect("/places");
  })
);

router.get(
  "/:id",
  // jika id salah, akan diarahkan ke halaman /places
  isValidObjectId("/places"),
  wrapAsync(async (req, res) => {
    const place = await Place.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    console.log(place);
    res.render("places/show", { place });
  })
);

router.get(
  "/:id/edit",
  isAuth,
  isAuthorPlace,
  isValidObjectId("/places"),
  wrapAsync(async (req, res) => {
    const place = await Place.findById(req.params.id);
    res.render("places/edit", { place });
  })
);

router.put(
  "/:id",
  isAuth,
  isAuthorPlace,
  isValidObjectId("/places"),
  validatePlace,
  wrapAsync(async (req, res) => {
    const place = await Place.findByIdAndUpdate(req.params.id, {
      // kode ... maksudnya agar data yang diupdate hanya value yang diberikan oleh body
      ...req.body.place,
    });
    req.flash("success_msg", "Place updated successfully");
    res.redirect(`/places/${req.params.id}`);
  })
);

router.delete(
  "/:id",
  isAuth,
  isValidObjectId("/places"),
  wrapAsync(async (req, res) => {
    await Place.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Place deleted successfully");
    res.redirect("/places");
  })
);

module.exports = router;
