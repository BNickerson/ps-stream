let mongoose = require('mongoose');

//Schema
let userSchema = mongoose.Schema({
    displayName: {
        type: String,
        require: true
    },
    googleId: {
        type: String,
        required: true
    },
    emails: {
        type: Array,
        require: false
    },
    name: {
        type: Object
    },
    photos: {
        type: Array
    },
    provider: {
        type: String
    },
    gender: {
        type: String
    }
});

let User = module.exports = mongoose.model('User', userSchema);