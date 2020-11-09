const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        min: 1,
        max: 3,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Session',sessionSchema);