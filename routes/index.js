var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('home', req.params.login);
});

router.get('/info', function(req, res) { 
    res.render('info', {});
});

router.get('/scrabble', function(req, res) {
  res.render('scrabble', {});
});

router.get('/kara', function(req, res) {
  res.render('index', { title: 'Kara' });
});

router.get('/home', function(req, res) {
    res.render('home', {});
}); 

router.post('/login', function(req, res) {
    if (req.body.password === "eliandmadi") {
	res.redirect('/info');
    } else {
	res.redirect('/?login=false');
    }
});

module.exports = router;
