let mongoose = require('mongoose');

//Schema
let configSchema = mongoose.Schema({
    type: {
        type: String,
        require: true
    },
    data: {
        type: String,
        required: true
    }
});

let Config = module.exports = mongoose.model('Config', configSchema);