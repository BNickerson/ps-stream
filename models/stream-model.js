let mongoose = require('mongoose');

//Schema
let streamSchema = mongoose.Schema({
    mainServer: {
        type: Boolean,
        require: true
    },
    link: {
        type: String,
        required: true
    }
});

let Stream = module.exports = mongoose.model('Stream', streamSchema);