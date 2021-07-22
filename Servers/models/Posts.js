const { time } = require('console');
const mongoose = require('mongoose');


const PostSchema = mongoose.Schema({
    user: {
        type: String,
        default: 'Guest'
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Posts', PostSchema);