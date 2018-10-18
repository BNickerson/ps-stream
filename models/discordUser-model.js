let mongoose = require('mongoose');

//Schema
let discordUserSchema = mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    upvotes: {
        type: Number,
        require: true
    },
    downvotes: {
        type: Number,
        require: true
    }
});

let DiscordUser = module.exports = mongoose.model('DiscordUser', discordUserSchema);