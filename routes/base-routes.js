const router = require('express').Router();
//const fs = require('fs');
const Configuration = require('../models/config-model');

router.get('/', async (req, res) => {
    try {
        let username = req.user ? req.user.username : null;

        let streamTitleConfig = await Configuration.findOne({ type: 'streamTitle'});
        let streamTitle = streamTitleConfig ? streamTitleConfig.data : 'No Stream Title';

        res.render('index', {
            title: 'Powerspike.net | Steelers Streams',
            streamTitle: streamTitle,
            username: username
        });
    } catch (e) {
        console.log(e);
        res.render('error', {
            error: 'Sorry, something went wrong!'
        });
    }
});

module.exports = router;