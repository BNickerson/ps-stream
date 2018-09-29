const Config = require('./private/config.json');
const path = require('path');

const express = require('express');
const app = express();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const io = require('socket.io')(server);
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('./public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Powerspike.net | Steelers Streams',
        streamTitle: JSON.parse(fs.readFileSync('./data.json')).title
    });
});

app.get('/setup/title/:key', (req, res) => {
    let key = req.params.key;
    if (key === Config.key) {
        let data = JSON.parse(fs.readFileSync('./data.json'));
        let title = data.title;
        res.render('admin', {
            title: title,
            key: key
        });
    } else {
        res.send('unauthorized');
    }
});
app.post('/setup/title/:key', (req, res) => {
    let key = req.params.key;
    if (key === Config.key) {
        let title = req.body.title;
        let data = JSON.parse(fs.readFileSync('./data.json'));
        data.title = title;
        fs.writeFileSync('./data.json', JSON.stringify(data));
        console.log(req.body.title);
        res.render('admin', {
            title: title,
            key: key
        });
    } else {
        res.send('unauthorized');
    }
});

app.post('/setup/title', (req, res) => {

});

let room1 = {
    source: Config.streams.room1,
	count: function() {
		return io.sockets.adapter.rooms['room1'] ? io.sockets.adapter.rooms['room1'].length : 0
	}
}, room2 = {
    source: Config.streams.room2,
	count: function() {
		return io.sockets.adapter.rooms['room2'] ? io.sockets.adapter.rooms['room2'].length : 0
	}
}
let getViewerCount = () => {
	return room1.count() + room2.count();
}
io.on('connection', (socket) => {
    if (room1.count() <= room2.count()) {
        socket.join('room1');
        socket.emit('source', room1.source);
        console.log(`Room 1: ${room1.count()} viewers`);
    } else {
        socket.join('room2');
        socket.emit('source', room2.source);
        console.log(`Room 2: ${room2.count()} viewers`);
    }
    io.sockets.emit('viewers', getViewerCount());
    socket.on('send-news', (message) => {
        io.sockets.emit('news', (message));
    });

    socket.on('send-message', () => {
        let message = {
            id: '12345',
            author: 'Sledge',
            content: '<h1>This is a test message from Blake!</h1><script>alert("test")<script>'
        }
        io.sockets.emit('new-message', message);
    });

	socket.on('disconnect', () => {
		io.sockets.emit('viewers', getViewerCount());
	});
});

server.listen(Config.port, () => console.log(`Listening on port ${Config.port}`));

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('message', (object) => {
    if (object.channel.id != '494328607012028425') return;

    let supporterRole;
    if (object.member.roles.find('name', 'Powerspike')) supporterRole = 'powerspike';
    else if (object.member.roles.find('name', 'Control Crew')) supporterRole = 'moderator';
    else if (object.member.roles.find('name', 'Diamond Supporter')) supporterRole = 'diamond';
    else if (object.member.roles.find('name', 'Platinum Supporter')) supporterRole = 'platinum';
    else if (object.member.roles.find('name', 'Gold Supporter')) supporterRole = 'gold';
    else supporterRole = 'none';

    let message = {
        author: object.author.username,
        content: object.content,
        id: object.id,
        role: supporterRole
    };
    io.sockets.emit('new-message', message);
});

let getRole = (roles) => {
    console.log('finding roles');
    roles.forEach((role, index) => {
        
    });
};

client.login(Config.discord.token);