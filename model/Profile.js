const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    firmid: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    firmname: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    firmdescription: {
        type: String,
        required: false,
    },
    firmpic: {
        data: Buffer,
        contentType: String,
        required: false,
    },
    updatetime: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Profile', profileSchema);
