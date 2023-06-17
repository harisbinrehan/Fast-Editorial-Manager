const mongoose = require('mongoose');
const reviewSchema = mongoose.Schema({
    editor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Editor',
        required: false,
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reviewer',
        required: false,
    },
    manuscript: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manuscript',
        required: false,
    },
    reviewstatus: {
        type: String,
        enum: {
            values: ['onreq', 'reject', 'pendingreview', 'completed'],
            message: 'The Review status should be either accept, reject, pendingreview or completed',
        },
    },
    commentstoeditor: {
        type: String,
        required: false,
    },
    commentstoauthor: {
        type: String,
        required: false,
    },
    manuscriptstatus: {
        type: String,

    },
    rating: {
        type: Number,
        enum: {
            values: [1, 2, 3, 4, 5],
            message: 'The rating should be either 1, 2, 3,4,5',
        },
    },
    figuresquality: {
        type: String,

    },
    contribution: {
        type: String,

    },
    grammatical_status: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
        required: false,
    },

});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review