var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rsvpSchema = new Schema({
    names : [String]
});

module.exports = mongoose.model('rsvp', rsvpSchema);
