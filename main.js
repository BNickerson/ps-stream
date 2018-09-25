const Config = require('./private/config.json');
const path = require('path');

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Powerspike.net | Steelers Streams',
    });
});

let connectCounter = 0;
io.on('connection', (socket) => {
    connectCounter++;
    io.sockets.emit('viewers', connectCounter);
    socket.on('send-news', (message) => {
        io.sockets.emit('news', (message));
    });
});


server.listen(Config.port, () => console.log(`Listening on port ${Config.port}`));


// DISCORD CONNECTION

// const Discord = require('discord.js');
// let client = new Discord.Client();

// client.on('ready', () => {
//     console.log('Connected to Discord');
//     io.sockets.emit('discord-connected');
// });


// client.login(Config.discord.token);