/**
 * Created by harsh on 8/10/2017.
 */
var mongoose = require('mongoose');

var venueSchema = mongoose.Schema({
    _id: String,
    name: String,
    location: String,
    imageUrl: String,
    hours: String,
    rating: String,
    ratingColor: String,
    _manager: {type: mongoose.Schema.Types.ObjectId, ref:'UserModel'},
    offerTitle : String,
    offerText : String,
    lat: String,
    lng: String,
    price: String,
    contact: String,
    url: String
}, {collection: "venue", _id: false});

module.exports = venueSchema;