const router = require('express').Router();
//const fs = require('fs');
const Configuration = require('../models/config-model');

router.get('/', async (req, res) => {
    try {
        let username = req.user ? (req.user.name.givenName ? req.user.name.givenName : req.user.displayName ) : null;

        let streamTitleConfig = await Configuration.findOne({ type: 'streamTitle'});
        let streamTitle = streamTitleConfig ? streamTitleConfig.data : 'No Stream Title';
        let donationLink = 'https://www.paypal.me/pools/c/8awiSstThk';

        res.render('index', {
            title: 'Powerspike.net | Steelers Streams',
            donationLink: donationLink,
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