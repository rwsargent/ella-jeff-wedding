var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.cookies.secretpassword) {
        if(req.cookies.secretpassword === 'ellassecretpassword' && req.cookies.name) {
            res.cookie('secretpassword', 'ellassecretpassword', {expires : new Date(Date.now() + 36000000), httpOnly: false});
            res.cookie('name', req.cookies.name, {expires : new Date(Date.now() + 36000000), httpOnly: false});
            res.render('home', {name:req.cookies.name, });
            return;
        }
    }
    res.render('login', {failed : req.query.login});
//    res.sendFile(path.join(__dirname, '/../views/login-raw.html'));
});

router.post('/authentication', function(req, res, next) {
    if (req.body.password === "ella") {
        res.cookie('secretpassword', 'ellassecretpassword', {maxAge: 9000});
        res.cookie('name', req.body.name, {maxAge: 9000});
        res.redirect('/');
    } else {
        res.redirect('/?login=false');
    }
});

module.exports = router;
