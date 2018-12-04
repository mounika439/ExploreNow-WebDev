/**
 * Created by mounika.
 */

(function () {
    angular
        .module("ExploreNow")
        .service("notificationService", notificationService);


    function notificationService($http) {
        this.findNotificationById = findNotificationById;
        this.createNotification = createNotification;
        this.updateNotification = updateNotification;
        this.deleteNotification = deleteNotification;
        this.findNotificationsForUser = findNotificationsForUser;
        this.findNotificationsForFollower = findNotificationsForFollower;

        function findNotificationById(notificationId) {
            return $http.get("/api/notification/"+notificationId)
                .then(function (response) {
                    return response.data;
                });
        }

        function createNotification(notification) {
            var url = "/api/notification";
            return $http.post(url,notification)
                .then(function (response) {
                    return response.data;
                });
        }

        function updateNotification(notificationId, notification) {
            var url = "/api/notification/"+notificationId;
            return $http.put(url, notification)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteNotification(notificationId) {
            return $http.delete("/api/notification/"+notificationId)
                .then(function (response) {
                    return response.data;
                });
        }

        function findNotificationsForUser(userId) {
            return $http.get("/api/notification/user/"+userId)
                .then(function (response) {
                    return response.data;
                });
        }

        function findNotificationsForFollower(userId) {
            return $http.get("/api/notification/follower/"+userId)
                .then(function (response) {
                    return response.data;
                });

        }

    }
})();
