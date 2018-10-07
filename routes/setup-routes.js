const router = require('express').Router();
const fs = require('fs');
const config = require('../private/config.json');
const Configuration = require('../models/config-model');
const Patreon = require('../models/patreon-model');
let io;

router.get('/title/:key', async (req, res) => {
    let key = req.params.key;
    if (key === config.key) {
        let streamTitleConfig = await Configuration.findOne({type:'streamTitle'});
        let streamTitle = streamTitleConfig.data;
        res.render('admin', {
            title: streamTitle,
            key: key
        });
    } else {
        res.send('unauthorized');
    }
});

router.post('/title/:key', async (req, res) => {
    let key = req.params.key;
    if (key === config.key) {
        let streamTitle = req.body.title;
        let existingTitle = await Configuration.findOne({type:'streamTitle'});
        if(existingTitle) {
            await Configuration.replaceOne({type:'streamTitle'}, {
                type:'streamTitle',
                data:streamTitle
            });
        } else {
            await new Configuration({
                type:'streamTitle',
                data:streamTitle
            }).save();
        }
        res.render('admin', {
            title: streamTitle,
            key: key
        });
    } else {
        res.send('unauthorized');
    }
});

router.get('/donation/:now/:total/:key', async (req, res) => {
    let key = req.params.key;
    if (key === config.key) {
        let now = req.params.now;
        let total = req.params.total;
        let existingDonationConfiguration = await Configuration.findOne({type:'donation'});
        if(existingDonationConfiguration) {
            await Configuration.replaceOne({type:'donation'}, {
                type:'donation',
                data:JSON.stringify({
                    now:now,
                    total:total
                })
            });
        } else {
            await new Configuration({
                type:'donation',
                data:JSON.stringify({
                    now:now,
                    total:total
                })
            }).save();
        }
        if(io) {
            io.sockets.emit('donation', {now, total});
        }
        res.send(now + '/' + total);
    } else {
        res.send('unauthorized');
    }
});

router.get('/patreons/new/:name/:level/:key', async (req, res) => {
    let key = req.params.key;
    if (key === config.key) {
        let name = req.params.name;
        let level = req.params.level;
        let patreon = await new Patreon({
            displayName:name,
            patreonLevel:level
        }).save();
        if(io) {
            io.sockets.emit('add-patreon', patreon);
        }
        res.send(patreon);
    } else {
        res.send('unauthorized');
    }
});

let injectIO = (sio) => {
    io = sio;
}

module.exports = { router, injectIO };