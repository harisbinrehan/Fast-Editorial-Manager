const mongoose = require('mongoose');
const authorSchema = mongoose.Schema({
  countOfAcceptedPapers: {
    type: Number,
    default: 0,
  },
  countOfPendingPapers: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

});
const Author = mongoose.model('Author', authorSchema);
module.exports = Author