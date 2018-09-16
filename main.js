const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

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