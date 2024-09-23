const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const placeSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  image: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// berguna untuk menghapus data review, jika data place-nya dihapus
placeSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: { $in: doc.reviews },
    });
  }
});

module.exports = mongoose.model("Place", placeSchema);
