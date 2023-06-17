const mongoose = require('mongoose');
const validators = require('validator');
const reviewerSchema = mongoose.Schema({
    countOfCompletedReviews: {
        type: Number,
        default: 0
    },
    majorField: {
        type: String,
        required: false
    },
    minorFields: {
        type: [String],
        required: false
    },
    verified: {
        type: Boolean,
        default: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});
const Reviewer = mongoose.model('Reviewer', reviewerSchema);
module.exports = Reviewer