let mongoose = require('mongoose');

//Schema
let patreonSchema = mongoose.Schema({
    displayName: {
        type: String,
        require: true
    },
    patreonLevel: {
        type: String,
        require: true
    },
    googleId: {
        type: String,
        required: false
    }
});

let Patreon = module.exports = mongoose.model('Patreon', patreonSchema);