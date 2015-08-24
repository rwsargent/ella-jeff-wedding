var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {

  var name = req.query.name;
  
  res.render('index', { title: name });
});

router.get('/kara', function(req, res) {
  res.render('index', { title: 'Kara' });
});

router.get('/:name/home', function(req, res) {
    res.render('index', {title: req.params.name});
});

module.exports = router;
