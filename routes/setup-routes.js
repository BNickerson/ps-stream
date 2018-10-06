const router = require('express').Router();
const fs = require('fs');
const config = require('../private/config.json');
const Configuration = require('../models/config-model');

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

module.exports = router;