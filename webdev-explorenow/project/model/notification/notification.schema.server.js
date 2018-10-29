/**
 * Created by mounika.
 */

var mongoose = require('mongoose');

var notificationSchema = mongoose.Schema({
    type: {type:String, enum:['FOLLOW', 'REVIEW', 'CHECKIN', 'STATUS', 'OFFER']},
    text: String,
    _user: {type: mongoose.Schema.Types.ObjectId,  ref: 'UserModel'},
    _venue: {type: mongoose.Schema.Types.ObjectId, ref:'VenueModel'},
    dateCreated: {type: Date, default: Date.now}
}, {collection: "notification"});

module.exports = notificationSchema;