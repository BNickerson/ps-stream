const Config = require('./private/config.json');
const path = require('path');

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
passport.use(new GoogleStrategy({
    consumerKey: '',
    consumerSecret: '',
    callbackURL: 'http://www.powerspike.net/auth/google/callback'
}, (token, tokenSecret, profile, done) => {
    console.log(token);
    console.log(tokenSecret);
    console.log(profile);
}));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/powerspike', { useNewUrlParser: true });
let db = mongoose.connection;

db.on('error', (error) => {
    console.log(error);
});

const User = require('./models/user');

app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    User.find({}, (error, users) => {
        if(error){
            console.log(error);
        } else {
            res.render('index', {
                title: 'Powerspike.net | Steelers Streams',
                users: users
            });
        }
    });
});

app.get('/auth/google', (req, res) => {
    passport.authenticate('google', { scope: ['profile']});
});

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    console.log(req);
    res.redirect('/');
  });

let connectCounter = 0;
io.on('connection', (socket) => {
    connectCounter++;
    io.sockets.emit('viewers', connectCounter);
    socket.on('send-news', (message) => {
        io.sockets.emit('news', (message));
    });
    socket.on('disconnect', (reason) => {
        connectCounter--;
    });
});


server.listen(Config.port, () => console.log(`Listening on port ${Config.port}`));


// DISCORD CONNECTION

const Discord = require('discord.js');
let client = new Discord.Client();

client.on('ready', () => {
    console.log('Connected to Discord');
    io.sockets.emit('discord-connected');
});


client.login(Config.discord.token);