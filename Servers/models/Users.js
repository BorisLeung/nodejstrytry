const mongoose = require('mongoose');
const { time } = require('console');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Users', UserSchema);