/**
 * Created by mounika.
 */

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    pictureUrl: {type: String, default: "/uploads/2cf04bc440827ec236b91b87d788ce97"},
    location: String,
    status: {type: String, default: "Hey there!"},
    following: [{type: mongoose.Schema.Types.ObjectId, ref:'UserModel'}],
    followers: [{type: mongoose.Schema.Types.ObjectId, ref:'UserModel'}],
    bookmarks: [{type: mongoose.Schema.Types.ObjectId, ref:'VenueModel'}],
    role: {type:String, enum:['USER', 'MANAGER', 'ADMIN']},
    _venue: {type: mongoose.Schema.Types.ObjectId, ref:'VenueModel'},
    google: {id: String,
    token: String},
    facebook: {id: String,
        token: String},
    dateCreated: {type: Date, default: Date.now}
}, {collection: "user"});

module.exports = userSchema;