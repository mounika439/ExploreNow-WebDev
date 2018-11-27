
var app = require("../../express");
var reviewModel = require("../model/review/review.model.server");

// http handlers:
app.get("/api/review/:reviewId", findReviewById);
app.get("/api/review/venue/:venueId", findReviewsForVenue);
app.get("/api/review/user/:userId", findReviewsForUser);
app.post("/api/review", createReview);
app.get("/api/review", findReviwByCredentials);
app.put("/api/review/:reviewId", updateReview);
app.delete("/api/review/:reviewId", deleteReview);

function createReview(req, res) {
    var review = req.body;
    reviewModel.createReview(review)
        .then(function (review) {
            res.json(review);
        }, function (err) {
            res.sendStatus(404).send(err);
        });
}

function findReviwByCredentials(req, res) {

    var userId = req.query.userId;
    var venueId = req.query.venueId;

    if (userId && venueId) {
        reviewModel.findReviewByCredentials(userId, venueId)
            .then(function (review) {
                res.json(review);
            }, function (err) {
                res.sendStatus(404).send(err);
            });
    }
}

function findReviewById(req, res) {
    reviewModel.findReviewById(req.params.reviewId)
        .then(function (review) {
            res.json(review);
        }, function (err) {
            res.sendStatus(404).send(err);
        });
}

function findReviewsForVenue(req, res) {
    reviewModel.findReviewsForVenue(req.params.venueId)
        .then(function (reviews) {
            res.json(reviews);
        }, function (err) {
            res.sendStatus(404).send(err);
        });
}

function findReviewsForUser(req, res) {
    reviewModel.findReviewsForUser(req.params.userId)
        .then(function (reviews) {
            res.json(reviews);
        }, function (err) {
            res.sendStatus(404).send(err);
        });
}

function updateReview(req, res) {
    var review = req.body;
    var reviewId = req.params.reviewId;
    reviewModel.updateReview(reviewId, review)
        .then(function (status) {
            res.json(status);
        }, function (err) {
            res.sendStatus(404).send(err);
        })
}

function deleteReview(req, res) {
    var reviewId = req.params.reviewId;
    reviewModel.deleteReview(reviewId)
        .then(function (status) {
            res.json(status);
        }, function (err) {
            res.sendStatus(404).send(err);
        })
}

