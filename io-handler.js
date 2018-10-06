
/***** STREAM ROOM SETUP ******/
const Stream = require('./models/stream-model');
const StreamRoom = require('./classes/Stream');
const Configuration = require('./models/config-model');
let io;
let streamRooms = [];

const ioHandler = {
    updateStreamRooms: () => {
        Stream.find().then((streams) => {
            streams.forEach((stream, index) => {
                let obj = new StreamRoom(index, stream.link, io);
                let findSource = streamRooms.find(x => {
                    return x.source == obj.source;
                });
                if (!findSource) streamRooms.push(obj);
            });
        });
    },
    start: (sio) => {
        io = sio;
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
            socket.on('getDonation', async () => {
                let donationData = await getDonationInfo();
                socket.emit('donation', donationData);
            });
            socket.on('disconnect', () => {
                io.sockets.emit('viewers', getViewerCount());
            });
        });

        updateStreamRooms();
        setInterval(() => {
            updateStreamRooms();
        }, 60000);
    },
    
}

const getDonationInfo = async () => {
    let donationConfiguration = await Configuration.findOne({ type: 'donation' });
    let donationData = donationConfiguration ? JSON.parse(donationConfiguration.data) : { now:0,total:0 };
    donationData.percentage = donationData.now/donationData.total;
    return donationData;
}
const getViewerCount = () => {
    let total = 0;
    streamRooms.forEach((room, index) => {
        total += room.getCount();
    });
    return total;
}

const updateStreamRooms = () => {
    Stream.find().then((streams) => {
        streams.forEach((stream, index) => {
            let obj = new StreamRoom(index, stream.link, io);
            let findSource = streamRooms.find(x => {
                return x.source == obj.source;
            });
            if (!findSource) streamRooms.push(obj);
        });
    });
}

module.exports = ioHandler;