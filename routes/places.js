const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const PlaceController = require("../controllers/places.js");
const isValidObjectId = require("../middleware/isValidObjectId");
const isAuth = require("../middleware/isAuth.js");
const { isAuthorPlace } = require("../middleware/isAuthor.js");
const { validatePlace } = require("../middleware/validator");
const upload = require("../config/multer.js");

router.route("/").get(wrapAsync(PlaceController.index)).post(isAuth, upload.array("image", 5), validatePlace, wrapAsync(PlaceController.store));
// .post(isAuth, upload.array("image", 5), (req, res) => {
//   console.log(req.files);
//   console.log(req.body);
//   res.send("It works");
// });

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
  .put(isAuth, isAuthorPlace, isValidObjectId("/places"), validatePlace, wrapAsync(PlaceController.update))
  .delete(isAuth, isValidObjectId("/places"), wrapAsync(PlaceController.destroy));

router.get("/:id/edit", isAuth, isAuthorPlace, isValidObjectId("/places"), wrapAsync(PlaceController.edit));

module.exports = router;
