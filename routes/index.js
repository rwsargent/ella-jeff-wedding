var express = require('express');
var router = express.Router();
var path = require('path');
var jade = require('jade');
var fs = require('fs');

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

router.get('/rsvp/:choice', function(req, res, next){
    res.send(renderPartial("rsvp/" + req.params.choice));
});

router.get('/tab/:info', function(req, res, next)  {
    var partial = req.params.info + ".partial.jade";
    var template = fs.readFileSync('./views/'+partial, 'utf8');
    var html = jade.render(template);
    res.send(html);
});

router.post('/regrets', function(req, res, next) {
    //write message
    res.send('<p>Fine.</p>');
});

router.post('/rsvp', function(req, res, next) {
    var names = req.body['names[]'];
    for(var nameIdx in names) {
	var name = names[nameIdx];
	console.log(name);
    }
    res.cookie('rsvp', 'successful', {expires : new Date(2147483647000)});
    var html = renderPartial('success-rsvp');
    res.send(html);
    
});

var renderPartial = function(filename, data) {
    filename = filename + ".jade";
    var template = fs.readFileSync('./views/'+filename, 'utf8');
    var html = jade.render(template);
  //  var jadeFn = jade.compile(template, { filename: partial, pretty: true });
//    var renderedTemplate = jadeFn({data: 1, hello: 'world'});
    return html
}

module.exports = router;
