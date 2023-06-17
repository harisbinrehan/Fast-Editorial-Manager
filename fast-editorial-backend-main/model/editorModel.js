const mongoose = require('mongoose');
const validator = require('validator');
const editorSchema = mongoose.Schema({
    countOfAcceptedPapers: {
        type: Number,
        default: 0,
    },
    countOfassigningreviewes: {
        type: Number,
        default: 0,
    },
    countOfPendingPapers: {
        type: Number,
        default: 0,
    },
    field: {
        type: String,
        required: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
    // link to manuscript schema
});
const Editor = mongoose.model('Editor', editorSchema);
module.exports = Editor