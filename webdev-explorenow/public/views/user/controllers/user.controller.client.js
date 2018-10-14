(function () {
    angular
        .module("ExploreNow")
        .controller("userController", userController);

    function userController($routeParams, $route, userService, venueService, reviewService, notificationService, $location, $rootScope, user) {
        var model = this;

        //Event handles:
        model.logout = logout;
        model.toNotification = toNotification;
        model.toFollowing = toFollowing;
        model.toFollower = toFollower;
        model.toBookmark = toBookmark;
        model.toReview = toReview;
        model.deleteReview = deleteReview;
        model.unfollowUser = unfollowUser;
        model.removeFollower = removeFollower;
        model.unbookmarkVenue = unbookmarkVenue;
        model.updateStatus = updateStatus;

        var userId = user._id;
        function init() {

            model.currentTab = "NOTIFICATION";

            userService.findUserByUserId(userId)
                .then(function (response) {
                    model.user = response;
                    if(response.role === "ADMIN"){
                        $location.url("/admin");
                    }
                });
            $rootScope.title = "Your profile";
            userService.findFollowingForUser(userId)
                .then(function (response) {
                    model.following = response;
                });

            userService.findFollowersForUser(userId)
                .then(function (response) {
                    model.followers = response;
                });

            venueService.findVenuesForUser(userId)
                .then(function (response) {
                    model.bookmark = response;
                });

            reviewService.findReviewsForUser(userId)
                .then(function (response) {
                    model.review = response.reverse();
                });

            notificationService.findNotificationsForFollower(userId).then(function (response) {
                model.notification = response.reverse();
            });
        }
        init();

        function logout() {
            userService.logout()
                .then(function (response) {
                    $location.url("/login");
                });
        }

        function toNotification() {
            model.currentTab = "NOTIFICATION";
        }

        function toFollowing() {
            model.currentTab = "FOLLOWING";
        }

        function toFollower() {
            model.currentTab = "FOLLOWERS";
        }

        function toBookmark() {
            model.currentTab = "BOOKMARK";
        }

        function toReview() {
            model.currentTab = "REVIEW";
        }

        function deleteReview(reviewId) {
            reviewService.deleteReview(reviewId)
                .then(function (response) {
                    $route.reload();
                });

        }

        function unfollowUser(followId) {
            userService.unfollowUser(userId, followId)
                .then(function (response) {
                    $route.reload();
                });

        }

        function removeFollower(followId) {
            userService.unfollowUser(followId, userId)
                .then(function (response) {
                    $route.reload();
                });
        }

        function unbookmarkVenue(venueId) {
            venueService.unbookmarkVenue(userId, venueId)
                .then(function (response) {
                    $route.reload();
                });

        }

        function updateStatus(user) {
            userService.updateUser(user._id, user);

            var notification = {type: "STATUS", _user: user._id, text: user.status};

            notificationService.createNotification(notification);
        }
    }
})();
