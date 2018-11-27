

var app = require("../../express");
var venueModel = require("../model/venue/venue.model.server");
var userModel = require("../model/user/user.model.server");

// http handlers:
app.get("/api/venues", getAllVenues);
app.get("/api/venue/:venueId", findVenueById);
app.get("/api/user/:userId/bookmark", findVenuesForUser);
app.post("/api/user/:userId/bookmark/:venueId", bookmarkVenue);
app.post("/api/venue", createVenue);
app.delete("/api/venue/:venueId", deleteVenue);
app.delete("/api/user/:userId/bookmark/:venueId", unbookmarkVenue);
app.put("/api/venue/:venueId", updateVenue);

function getAllVenues(req, res) {
    venueModel.getAllVenues()
        .then(function (venues) {
            res.json(venues);
        }, function (err) {
            res.sendStatus(404).send(err);
        });
}

function createVenue(req, res) {
    var venue = req.body;
    venueModel.createVenue(venue)
        .then(function (venue) {
            res.json(venue);
        }, function (err) {
            res.sendStatus(404).send(err);
        });
}

function findVenueById(req, res) {
    venueModel.findVenueById(req.params.venueId)
        .then(function (venue) {
            res.json(venue);
        }, function (err) {
            res.sendStatus(404).send(err);
        });
}

function findVenuesForUser(req, res) {
    venueModel.findVenuesForUser(req.params.userId)
        .then(function (user) {
            res.json(user.bookmarks);
        }, function (err) {
            res.sendStatus(404).send(err);
        });
}

function bookmarkVenue(req, res) {
    var userId = req.params.userId;
    venueModel.bookmarkVenue(userId, req.params.venueId)
        .then(function (status) {
            res.json(status);
        }, function (err) {
            res.sendStatus(404).send(err);
        });
}

function unbookmarkVenue(req, res) {
    var userId = req.params.userId;
    venueModel.unbookmarkVenue(userId, req.params.venueId)
        .then(function (status) {
            res.json(status);
        }, function (err) {
            res.sendStatus(404).send(err);
        });
}

function updateVenue(req, res) {
    var venue = req.body;
    var venueId = req.params.venueId;
    venueModel.updateVenue(venueId, venue)
        .then(function (status) {
            res.json(status);
        }, function (err) {
            res.sendStatus(404).send(err);
        })
}

function deleteVenue(req, res) {
    var venueId = req.params.venueId;
    venueModel.deleteVenue(venueId)
        .then(function (status) {
            res.json(status);
        }, function (err) {
            res.sendStatus(404).send(err);
        })
}


