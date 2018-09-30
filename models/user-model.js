let mongoose = require('mongoose');

//Schema
let userSchema = mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    googleId: {
        type: String,
        required: true
    }
});

let User = module.exports = mongoose.model('User', userSchema);