const mongoose = require('mongoose');
const validator = require('validator');
const manuscriptSchema = mongoose.Schema({
    title: {
        type: String,
    },
    abstract: {
        type: String,
    },
    //foreign key to link to author schema
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
    },
    editor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Editor',
    },
    plagReport: {
        type: Object
    },
    date: {
        type: Date,
        default: Date.now,
    },
    minorfields: {
        type: [String],
    },
    majorfield: {
        type: String,
    },
    correspondingAuthorName: {
        type: String,
    },
    correspondingAuthorPhone: {
        type: String,
    },
    correspondingAuthorEmail: {
        type: String,
    },
    additionalComments: {
        type: [String],
    },
    status: {
        type: String,
        enum: {
            values: ['draft', 'submitted', 'pendingReview', 'reviewerAssigned', 'reviewComplete', 'minorChanges', 'majorChanges', 'changesDone', 'accepted', 'rejected'],
        },
    },
    manuscript: {
        type: String,
    },
    authorPhoto: {
        type: String,
    },
    authorBiography: {
        type: String,
    },
    commentsFromEditor: {
        type: String,
    },
    department: {
        type: String,
    },
    commentsFromReviewer: {
        type: [String],
    },
    reviewIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
        required: false
    }],
    recommendedReviewers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
        required: false
    }]

})
const Manuscript = mongoose.model('Manuscript', manuscriptSchema);
module.exports = Manuscript