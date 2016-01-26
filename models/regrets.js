var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var regretSchema = new Schema({
    message : String,
    names : [String]
});

module.exports = mongoose.model('regrets', regretSchema);
