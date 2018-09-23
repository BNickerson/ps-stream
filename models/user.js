let mongoose = require('mongoose');

//Schema
let userSchema = mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    }
});

let User = module.exports = mongoose.model('User', userSchema);