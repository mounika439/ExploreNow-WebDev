/**
 * Created by mounika.
 */

var mongoose = require('mongoose');
var reviewSchema = require('./review.schema.server');
var db = require("../models.server");

var reviewModel = mongoose.model("ReviewModel", reviewSchema);
reviewModel.createReview = createReview;
reviewModel.findReviewById = findReviewById;
reviewModel.updateReview = updateReview;
reviewModel.deleteReview = deleteReview;
reviewModel.findReviewsForVenue = findReviewsForVenue;
reviewModel.findReviewsForUser = findReviewsForUser;
reviewModel.findReviewByCredentials = findReviewByCredentials;
module.exports = reviewModel;

function createReview(review) {
    return reviewModel.create(review);
}

function findReviewById(id) {
    return reviewModel.findById(id)
        .populate('_user')
        .exec();
}

function findReviewsForVenue(venueId) {
    return reviewModel.find({_venue: venueId}).populate('_user').exec();
}

function findReviewsForUser(userId) {
    return reviewModel.find({_user: userId});
}

function updateReview(reviewId, newReview) {
    return reviewModel.update({_id: reviewId}, {$set: newReview});
}

function deleteReview(reviewId) {
    return reviewModel
        .findById(reviewId)
        .then(function (review) {
            return reviewModel.remove({_id: reviewId});
        });
}

function findReviewByCredentials(userId, venueId) {
    return reviewModel.findOne({_user: userId, _venue: venueId});
}
