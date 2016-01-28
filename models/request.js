var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var requestSchema = new Schema({
    artist : String,
    title : String
});

module.exports = mongoose.model('request', requestSchema);
