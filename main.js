const config = require('./private/config.json');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const passportSetup = require('./config/passport-setup');
const DiscordBot = require('discord.js');

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

/***** STREAM ROOM SETUP ******/
const Stream = require('./models/stream-model');
let streamRooms = [];

const updateStreamRooms = () => {
    Stream.find().then((streams) => {
        streams.forEach((stream, index) => {
            let obj = {
                room: index,
                source: stream.link,
                getCount: function() {
                    return io.sockets.adapter.rooms[this.room] ? io.sockets.adapter.rooms[this.room].length : 0;
                }
            };
            let findSource = streamRooms.find(x => {
                return x.source == obj.source;
            });
            if (!findSource) streamRooms.push(obj);
        });
    });
};

//get initial streams and go and update the stream rooms every minute
updateStreamRooms();
setInterval(() => {
    updateStreamRooms();
}, 60000);

const getViewerCount = () => {
    let total = 0;
    streamRooms.forEach((room, index) => {
        total += room.getCount();
    });
	return total;
};

io.on('connection', (socket) => {
    if(streamRooms.length < 1) {
        console.log('Loaded website without stream rooms loaded.');
        return;
    }
    
    let streamToConnect;
    if (streamRooms.length <= 1) {
        streamToConnect = streamRooms[0];
    } else {
        streamToConnect = streamRooms[0] ? streamRooms[0] : 999999;
        streamRooms.forEach((room, index) => {
            if(streamToConnect.getCount() > room.getCount() || room.getCount() == 0) streamToConnect = room;
        });
    }
    
    socket.join(streamToConnect.room);
    socket.emit('source', streamToConnect.source);
    socket.emit('connected');
    io.sockets.emit('viewers', getViewerCount());

    socket.on('check-rooms', () => {
        streamRooms.forEach((stream, index) => {
            console.log(`Room ${stream.room}: ${stream.getCount()} viewers`);
        });
    });
    socket.on('update-stream-rooms', () => {
        updateStreamRooms();
    });
	socket.on('disconnect', () => {
		io.sockets.emit('viewers', getViewerCount());
    });
});

server.listen(config.port, () => console.log(`Listening on port ${config.port}`));


const Discord = require('discord.js');
const client = new Discord.Client();

client.on('message', (object) => {
    if (object.channel.id != '494288862114218005' && object.channel.id != '494328607012028425') return;

    let supporterRole;
    if (object.member.roles.find(x => x.name == 'Powerspike')) supporterRole = 'powerspike';
    else if (object.member.roles.find(x => x.name == 'Control Crew')) supporterRole = 'moderator';
    else if (object.member.roles.find(x => x.name == 'Diamond Supporter')) supporterRole = 'diamond';
    else if (object.member.roles.find(x => x.name == 'Platinum Supporter')) supporterRole = 'platinum';
    else if (object.member.roles.find(x => x.name == 'Gold Supporter')) supporterRole = 'gold';
    else supporterRole = 'none';

    let message = {
        author: object.author.username,
        content: object.content,
        id: object.id,
        role: supporterRole
    };
    io.sockets.emit('new-message', message);
});

client.on('messageDelete', (object) => {
    if (object.channel.id != '494288862114218005' && object.channel.id !=  '494328607012028425') return;
    io.sockets.emit('delete-message', object.id);
});

client.login(config.discord.token);