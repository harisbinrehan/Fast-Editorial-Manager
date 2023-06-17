const mongoose = require("mongoose");
const recommendSchema = mongoose.Schema({
  firstName: {
    type: String,
    default: 0,
  },
  lastName: {
    type: String,
    default: 0,
  },
  degree: {
    type: String,
    required: false,
  },
  position: {
    type: String,
    required: false,
  },
  organisation: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  department: {
    type: String,
    required: false,
  },
  majorField: {
    type: String,
    required: false,
  },
  minorFields: {
    type: [String],
    required: false,
  },
  manuscript: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manuscript",
    // type: String,
    required: false,
  },
});
const Recommend = mongoose.model("Recommend", recommendSchema);
module.exports = Recommend;
