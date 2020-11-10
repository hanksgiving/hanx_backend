const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    message: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    shortcut: {
        type: String,
        required: false,
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notice', noticeSchema);
