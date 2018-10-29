/**
 * Created by harsh on 8/10/2017.
 */

var mongoose = require('mongoose');
var venueSchema = require('./venue.schema.server');
var db = require("../models.server");

var venueModel = mongoose.model("VenueModel", venueSchema);
venueModel.createVenue = createVenue;
venueModel.findVenueById = findVenueById;
venueModel.getAllVenues = getAllVenues;
venueModel.updateVenue = updateVenue;
venueModel.deleteVenue = deleteVenue;
venueModel.bookmarkVenue = bookmarkVenue;
venueModel.unbookmarkVenue = unbookmarkVenue;
venueModel.findVenuesForUser = findVenuesForUser;
module.exports = venueModel;

var userModel = require("../user/user.model.server");

function createVenue(venue) {
    return venueModel.create(venue);
}

function findVenueById(id) {
    return venueModel.findById(id);
}

function getAllVenues() {
    return venueModel.find();
}

function updateVenue(venueId, newVenue) {
    return venueModel.update({_id: venueId}, {$set: newVenue});
}

function deleteVenue(venueId) {
    return venueModel
        .findById(venueId)
        .then(function (venue) {
            return venueModel.remove({_id: venueId});
        });
}

function bookmarkVenue(userId, venueId) {
    return userModel
        .findById(userId)
        .then(function (user) {
            user.bookmarks.push(venueId);
            return user.save();
        })
}

function unbookmarkVenue(userId, venueId) {
    return userModel
        .findById(userId)
        .then(function (user) {
            var index = user.bookmarks.indexOf(venueId);
            user.bookmarks.splice(index, 1);
            return user.save();
        })
}

function findVenuesForUser(userId) {
    return userModel.findById(userId)
        .populate('bookmarks')
        .exec();
}
