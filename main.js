const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 80;

app.use(express.static(__dirname + '/public'));
console.log(__dirname + '/public');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

let connectCounter = 0;
io.on('connection', (socket) => {
    connectCounter++;
    io.sockets.emit('viewers', connectCounter);
    socket.on('send-news', (message) => {
        io.sockets.emit('news', (message));
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));


// DISCORD CONNECTION

const Discord = require('discord.js');
const Config = require('./private/config.json');

let client = new Discord.Client();

client.on('ready', () => {
    console.log('Connected to Discord.');
    io.sockets.emit('discord-connected');
});

client.on('message', (message) => {
    let role;
    if(!message.member.roles) return;
    if(message.member.roles.find(x => x.name == 'Steeler Mods')) {
        role = message.member.roles.find(x => x.name == 'Steeler Mods').hexColor;
    } else if (message.member.roles.find(x => x.name == 'Control Crew')) {
        role = message.member.roles.find(x => x.name == 'Control Crew').hexColor;
    } else if (message.member.roles.find(x => x.name == 'Yinzers')) {
        role = message.member.roles.find(x => x.name == 'Yinzers').hexColor;
    } else {
        role = '#000';
    }
    let packet = { 
        content: message.content,
        user: {
            username: message.author.username,
            tag: message.author.tag,
            color: role,
            avatar: message.author.displayAvatarURL
        }   
    };
    io.sockets.emit('message', packet);
});

client.login(Config.discord.token);