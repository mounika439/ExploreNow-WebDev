/**
 * Created by mounika.
 */

var mongoose = require('mongoose');
var notificationSchema = require('./notification.schema.server');
var db = require("../models.server");

var notificationModel = mongoose.model("notificationModel", notificationSchema);
notificationModel.createNotification = createNotification;
notificationModel.findNotificationById = findNotificationById;
notificationModel.updateNotification = updateNotification;
notificationModel.deleteNotification = deleteNotification;
notificationModel.findNotificationsForUser = findNotificationsForUser;
notificationModel.findNotificationsForFollower = findNotificationsForFollower;
module.exports = notificationModel;

var userModel = require('../user/user.model.server');

function createNotification(notification) {
    return notificationModel.create(notification);
}

function findNotificationById(id) {
    return notificationModel.findById(id);
        // .populate('_user')
        // .exec();
}

function findNotificationsForUser(userId) {
    return notificationModel.find({_user: userId});
}

function findNotificationsForFollower(arrayOfIds) {
    return notificationModel.find({ _user: { $in : arrayOfIds } })
        .populate('_user')
        .populate('_venue')
        .exec();
}

function updateNotification(notificationId, newNotification) {
    return notificationModel.update({_id: notificationId}, {$set: newNotification});
}

function deleteNotification(notificationId) {
    return notificationModel
        .findById(notificationId)
        .then(function (notification) {
            return notificationModel.remove({_id: notificationId});
        });
}
