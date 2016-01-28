var express = require('express');
var router = express.Router();
var path = require('path');
var jade = require('jade');
var fs = require('fs');
var RSVP = require("./../models/rsvp.js");
var Request = require("./../models/request.js");
var Regret = require('./../models/regrets.js');
/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.cookies.secretpassword) {
        if(req.cookies.secretpassword === 'congratsYouKnowHowToLookAtCookies') {
            res.cookie('secretpassword', 'congratsYouKnowHowToLookAtCookies', {expires : new Date(Date.now() + 36000000), httpOnly: false});
	    var apiKey = require('../tokens.json').gmapApiToken;
	    console.log(apiKey);
            res.render('home', {apiKey : apiKey});
            return;
        }
    }
    res.render('login', {failed : req.query.login});
});

router.get('/dashboard/get-spreadsheet', function(req, res, next) {
    var header = "RSVPs\tRegrets\tMessages\tTitle\tArtist\n";
    RSVP.find({}, function(err, rsvps) {
	if(err) { 
	    res.render('error');
	    return next();
	}
	Request.find({}, function(err, requests) {
	    if(err) {
		res.render('error');
		return next();
	    }
	    Regret.find({}, function(err, regrets) {
		if(err) {
		    res.render('error');
		    return next();
		}
		var rsvpList = flattenOutNames(rsvps);
		var regretList = flattenOutNames(regrets);
		var messages = getMessages(regrets);
		var tsv = header, rowNum = 0, building = true;
		var delim = "\t";
		while(building) {
		    var row = "", keepGoing = false;;
		    if(rsvpList[rowNum]){
			row += rsvpList[rowNum];
			keepGoing = true;
		    }
		    row += delim;
		    if(regretList[rowNum]){
			row += regretList[rowNum];
			keepGoing = true;
		    }
		    row += delim;
		    if(messages[rowNum]) {
			row += messages[rowNum];
			keepGoing = true;
		    }
		    row += delim;
		    if(requests[rowNum]) {
			var request = requests[rowNum];
			row += request.title + delim;
			row += request.artist + delim;
			keepGoing = true;
		    }
		    if(!keepGoing) {
			break;
		    }
		    rowNum++;
		    tsv += row + "\n";
		}
		res.header("Content-Type", "text/tab-separated-values");
		res.header("Content-Disposition", "filename=wedding_planning.tsv");
		res.send(tsv);
	    });
	});
    });
});


router.get('/dashboard/rsvp', function(req, res, next) {
    RSVP.find({}, null, {sort: {name: 1}}, function(err, rsvps) {
	var data = { names : []};
	for(var rsvpIdx in rsvps) {
	    var rsvp = rsvps[rsvpIdx];
	    for(var nameIdx =0; nameIdx < rsvp.names.length; nameIdx++) {
		var name = rsvp.names[nameIdx];
		data.names.push(name);
	    }
	}
	data.names.sort();
	res.render('dashboard-rsvp', data);
    });
});

router.get('/dashboard', function(req, res, next) {
    RSVP.find({}, function(err, rsvps) {
	if(err) { 
	    res.render('error');
	    return next();
	}
	Request.find({}, function(err, requests) {
	    if(err) {
		res.render('error');
		return next();
	    }
	    Regret.find({}, function(err, regrets) {
		if(err) {
		    res.render('error');
		    return next();
		}
		var messages = getMessages(regrets);
		data = {
		    rsvp : {
			names :flattenOutNames(rsvps)
		    },
		    regrets : regrets,
		    requests : requests
		};
		res.render('dashboard', data);
	    });
	});
    });
});

router.post('/authentication', function(req, res, next) {
    if (req.body.password === "KitsBeach") {
        res.cookie('secretpassword', 'congratsYouKnowHowToLookAtCookies', {maxAge: 9000});
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
    var names = req.body['names[]'];
    var regret = Regret();
    regret.names = names;
    regret.message = req.body.message;
    regret.save(function(err) {
	var html = "<p>We're so sorry you can't make it. If your plans change, please let us know!</p>";
	if(err) {
	    html = renderPartial('save-error');
	} 
	res.send(html);
    });
});

router.post('/rsvp', function(req, res, next) {
    var rsvpObject = RSVP({
	names : req.body['names[]']
    });
    var reqObject = Request({
	artist : req.body.artist,
	title : req.body.title
    });
    reqObject.save();
    rsvpObject.save(function(err) {
	var html = renderPartial('success-rsvp');
	if(err) {
	    html = renderPartial('save-error');
	}
	res.send(html);
    });
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
};

var flattenOutNames = function(responses) {
    var list = [];
    for(var rId in responses) {
	for(var nId =0; nId < responses[rId].names.length; nId++) {
	    list.push(responses[rId].names[nId]);
	}
    }
    return list;
};

var getMessages = function(regrets) {
    var messages = [];
    for(var rId in regrets) {
	var message = regrets[rId].message;
	if (message) {
	    messages.push(message);
	}
    }
    return messages;
};

module.exports = router;

