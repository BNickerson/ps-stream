const router = require('express').Router();
const Stream = require('../models/stream-model');
const config = require('../private/config.json');

router.get('/', (req, res) => {
    Stream.find().then((streams) => {
        res.send(streams);
    });
});

router.get('/new/:stream/:main/:key', async (req, res) => {
    let key = req.params.key;
    if (key === config.key) {
        let link = req.params.stream;
        let existingStream = await Stream.findOne({link:link});
        if(existingStream) {
            res.send('Stream already exists');
        } else {
            let newStream = await new Stream({
                link: link,
                mainServer: req.params.main
            }).save();
            res.send(newStream);
        }
    } else {
        res.send('unauthorized');
    }
});

module.exports = router;