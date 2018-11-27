
var app = require("../../express");
var notificationModel = require("../model/notification/notification.model.server");
var userModel = require("../model/user/user.model.server");

// http handlers:
app.get("/api/notification/:notificationId", findNotificationById);
app.get("/api/notification/user/:userId", findNotificationsForUser);
app.get("/api/notification/follower/:userId", findNotificationsForFollower);
app.post("/api/notification", createNotification);
app.delete("/api/notification/:notificationId", deleteNotification);
app.put("/api/notification/:notificationId", updateNotification);

function createNotification(req, res) {
    var notification = req.body;
    notificationModel.createNotification(notification)
        .then(function (notification) {
            res.json(notification);
        }, function (err) {
            res.sendStatus(404).send(err);
        });
}

function findNotificationById(req, res) {
    notificationModel.findNotificationById(req.params.notificationId)
        .then(function (notification) {
            res.json(notification);
        }, function (err) {
            res.sendStatus(404).send(err);
        });
}

function findNotificationsForUser(req, res) {
    notificationModel.findNotificationsForUser(req.params.userId)
        .then(function (notifications) {
            res.json(notifications);
        }, function (err) {
            res.sendStatus(404).send(err);
        });
}

function findNotificationsForFollower(req, res) {
    var arrayOfIds;
    userModel.findUserById(req.params.userId).then(function (response) {
        arrayOfIds = response.following;
        notificationModel.findNotificationsForFollower(arrayOfIds)
            .then(function (notifications) {
                res.json(notifications);
            }, function (err) {
                res.sendStatus(404).send(err);
            });
    });


}

function updateNotification(req, res) {
    var notification = req.body;
    var notificationId = req.params.notificationId;
    notificationModel.updateNotification(notificationId, notification)
        .then(function (status) {
            res.json(status);
        }, function (err) {
            res.sendStatus(404).send(err);
        })
}

function deleteNotification(req, res) {
    var notificationId = req.params.notificationId;
    notificationModel.deleteNotification(notificationId)
        .then(function (status) {
            res.json(status);
        }, function (err) {
            res.sendStatus(404).send(err);
        })
}


