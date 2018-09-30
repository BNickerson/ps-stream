const router = require('express').Router();
const Stream = require('../models/stream-model');
const config = require('../private/config.json');

router.get('/', (req, res) => {
    Stream.find().then((streams) => {
        res.send(streams);
    });
});

router.get('/new/:stream/:main/:key', (req, res) => {
    let key = req.params.key;
    if (key === config.key) {
        let link = req.params.stream;
        Stream.findOne({link:link}).then((existingStream) => {
            if(existingStream) {
                res.send('Stream already exists');
            } else {
                new Stream({
                    link: link,
                    mainServer: req.params.main
                }).save().then((newStream) => {
                    res.send(newStream);
                });
            }
        });
    } else {
        res.send('unauthorized');
    }
});

module.exports = router;