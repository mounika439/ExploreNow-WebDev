/**
 * Created by mounika.
 */

var q = require('q');

var connectionString = 'mongodb://localhost:27017/explorenow'; // for local
if(process.env.MLAB_USERNAME) { // check if running remotely
    var username = process.env.MLAB_USERNAME; // get from environment
    var password = process.env.MLAB_PASSWORD;
    connectionString = 'mongodb://' + username + ':' + password;
    connectionString += '@ds139619.mlab.com:39619/heroku_rmg52nng'; // user yours
}

var mongoose = require("mongoose");
var db = mongoose.connect(connectionString,{ useNewUrlParser: true });
mongoose.Promise = q.Promise;

module.exports = db;
