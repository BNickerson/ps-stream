class Stream {
    constructor(room, streamLink, io) {
        this.room = room;
        this.source = streamLink;
        this.io = io;
    }

    getCount() {
        return this.io.sockets.adapter.rooms[this.room] ? this.io.sockets.adapter.rooms[this.room].length : 0;
    }
}

module.exports = Stream;