/**
 * Created by mounika.
 */
var mongoose = require('mongoose');
var userSchema = require('./user.schema.server');
var db = require("../models.server");

var userModel = mongoose.model("UserModel", userSchema);
userModel.createUser = createUser;
userModel.findUserById = findUserById;
userModel.findUserByUsername = findUserByUsername;
userModel.findUserByCredentials = findUserByCredentials;
userModel.getAllUsers = getAllUsers;
userModel.updateUser = updateUser;
userModel.deleteUser = deleteUser;
userModel.followUser = followUser;
userModel.unfollowUser = unfollowUser;
userModel.findFollowingForUser = findFollowingForUser;
userModel.findFollowersForUser = findFollowersForUser;
userModel.findUserByGoogleId = findUserByGoogleId;
userModel.findUserByFacebookId = findUserByFacebookId;
module.exports = userModel;

function createUser(user) {
    return userModel.create(user);
}

function findUserById(id) {
    return userModel.findById(id);
}

function findFollowingForUser(userId) {
    return userModel.findById(userId)
        .populate('following')
        .exec();
}

function findFollowersForUser(userId) {
    return userModel.findById(userId)
        .populate('followers')
        .exec();
}

function findUserByUsername(username) {
    return userModel.findOne({username: username});
}

function findUserByCredentials(username, password) {
    return userModel.findOne({username: username, password: password});
}

function getAllUsers() {
    return userModel.find();
}

function updateUser(userId, newUser) {
    return userModel.update({_id: userId}, {$set: newUser});
}

function createAdmin(userId) {
    return userModel.update({_id: userId}, {role: "ADMIN"});
}

function deleteUser(userId) {
    return userModel
        .findById(userId)
        .then(function (user) {
            return userModel.remove({_id: userId});
        });
}



function followUser(userId, followId) {
    return userModel
        .findById(followId)
        .then(function (user) {
            user.followers.push(userId);
            user.save();
            return userModel.findById(userId);
        }).then(function (user) {
            user.following.push(followId);
            return user.save();
        });
}

function unfollowUser(userId, followId) {
    return userModel
        .findById(userId)
        .then(function (user) {
            var index = user.following.indexOf(followId);
            user.following.splice(index, 1);
            user.save();
            userModel
                .findById(followId)
                .then(function (user) {
                    var index = user.followers.indexOf(userId);
                    user.followers.splice(index, 1);
                    return user.save();
                });
        });
}

function findUserByGoogleId(googleId) {
    return userModel.findOne({'google.id': googleId});
}

function findUserByFacebookId(facebookId) {
    return userModel.findOne({'facebook.id': facebookId});
}
