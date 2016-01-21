var express = require('express');
var router = express.Router();
var path = require('path');
var jade = require('jade');
var fs = require('fs');
var RSVP = require("./../models/rsvp.js");
/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.cookies.secretpassword) {
        if(req.cookies.secretpassword === 'ellassecretpassword') {
            res.cookie('secretpassword', 'ellassecretpassword', {expires : new Date(Date.now() + 36000000), httpOnly: false});
	    var apiKey = require('../tokens.json').gmapApiToken;
	    console.log(apiKey);
            res.render('home', {apiKey : apiKey});
            return;
        }
    }
    res.render('login', {failed : req.query.login});
});

router.get('/dashboard/rsvp', function(req, res, next) {
    RSVP.find({}, null, {sort: {name: 1}}, function(err, rsvps) {
	var data = { names : []};
	for(var rsvpIdx in rsvps) {
	    var rsvp = rsvps[rsvpIdx];
	    data.names.push(rsvp.name);
	}
	res.render('dashboard-rsvp', data);
    });
});

router.post('/authentication', function(req, res, next) {
    if (req.body.password === "ella") {
        res.cookie('secretpassword', 'ellassecretpassword', {maxAge: 9000});
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
    var html = jade.render(template, { apiKey : apiKey });
    res.send(html);
});

router.post('/regrets', function(req, res, next) {
    //write message
    res.send('<p>Fine.</p>');
});

router.post('/rsvp', function(req, res, next) {
    var names = req.body['names[]'];
    var nameLength = names.length;
    var valid = true;
    for(var nameIdx in names) {
	var name = names[nameIdx];
	var rsvpObject = RSVP({
	    name : name
	});
	rsvpObject.save();
    }
    var html = renderPartial('success-rsvp');
    res.send(html);
});

var renderPartial = function(filename, data) {
    filename = filename + ".jade";
    var template = fs.readFileSync('./views/'+filename, 'utf8');
    var html = jade.render(template);
    if(data) {
	var jadeFn = jade.compile(template, { filename: partial, pretty: true });
	html = jadeFn(data);
    }
    return html;
}

module.exports = router;
