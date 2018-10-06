const config = require('./private/config.json');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const passportSetup = require('./config/passport-setup');

const path = require('path');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('./public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const cookieSession = require('cookie-session');
app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys: [config.session.cookieKey]
}));

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

/****** DB CONNECTION ******/
const mongoose = require('mongoose');
mongoose.connect(config.mongodb, () => {
    console.log('Connected to MongoDB');
});

/****** APPLICATION ROUTES *******/
const authRoutes = require('./routes/auth-routes');
const setupRoutes = require('./routes/setup-routes');
const profileRoutes = require('./routes/profile-routes');
const baseRoutes = require('./routes/base-routes');
const streamRoutes = require('./routes/stream-routes');

app.use('/auth', authRoutes);
app.use('/setup', setupRoutes);
app.use('/profile', profileRoutes);
app.use('/streams', streamRoutes);
app.use('/', baseRoutes);

/****** SOCKET.IO HANDLER ******/
const ioHandler = require('./io-handler');
ioHandler.start(io);
server.listen(config.port, () => console.log(`Listening on port ${config.port}`));

/****** DISCORD HANDLER ******/
const discordHandler = require('./discord-handler');
discordHandler.start(io);