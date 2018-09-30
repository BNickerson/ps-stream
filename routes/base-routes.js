const router = require('express').Router();
const fs = require('fs');

router.get('/', (req, res) => {
    let username = req.user ? req.user.username : null;
    res.render('index', {
        title: 'Powerspike.net | Steelers Streams',
        streamTitle: JSON.parse(fs.readFileSync('./data.json')).title,
        username: username
    });
});

module.exports = router;