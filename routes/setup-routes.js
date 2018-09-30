const router = require('express').Router();
const fs = require('fs');
const config = require('../private/config.json');

router.get('/title/:key', (req, res) => {
    let key = req.params.key;
    if (key === config.key) {
        let data = JSON.parse(fs.readFileSync('./data.json'));
        let title = data.title;
        res.render('admin', {
            title: title,
            key: key
        });
    } else {
        res.send('unauthorized');
    }
});

router.post('/title/:key', (req, res) => {
    let key = req.params.key;
    if (key === config.key) {
        let title = req.body.title;
        let data = JSON.parse(fs.readFileSync('./data.json'));
        data.title = title;
        fs.writeFileSync('./data.json', JSON.stringify(data));
        console.log(req.body.title);
        res.render('admin', {
            title: title,
            key: key
        });
    } else {
        res.send('unauthorized');
    }
});

module.exports = router;