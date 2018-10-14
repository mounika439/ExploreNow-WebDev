/**
 * Created by mounika.
 */

(function () {
    angular
        .module("ExploreNow")
        .controller("detailManagerController", detailManagerController);

    function detailManagerController($rootScope, $routeParams, venueService, notificationService, userService, reviewService, $location, $route, user) {
        var model = this;

        //Event handles:
        model.logout = logout;
        model.addReply = addReply;
        model.updateReply = updateReply;
        model.deleteReply = deleteReply;
        model.updateOffer = updateOffer;
        model.deleteOffer = deleteOffer;
        model.toggleReply = toggleReply;

        var vid = $routeParams["vid"];
        var currentUser;
        var venue;
        var venueExists = false;
        var replyOn = false;

        function init() {
            model.vid = vid;
            model.bookmarked = false;
            model.replyOn = replyOn;
            venueService.findVenueByVenueId(vid).then(function (response) {
                if(!response){
                    venueService.searchVenueById(vid)
                        .then(function (response) {
                            venue = response.response.venue;
                            venue.location = venue.location.formattedAddress;
                            model.venue = venue;
                            $rootScope.title = venue.name;
                        });
                }
                else {
                    venue = response;
                    model.venue = venue;
                    venueExists = true;
                    $rootScope.title = venue.name;
                }

                model.loggedin = true;
                model.uid = user._id;
                model.user = user;
            });

            reviewService.findReviewsForVenue(vid).then(function (response) {
                model.reviews = response.reverse();
            });


        }

        init();

        function logout() {
            userService.logout()
                .then(function (response) {
                    $location.url("/login");
                });
        }

        function toggleReply() {
            if(replyOn){
                replyOn = false;
                model.replyOn = replyOn;
            } else {
                replyOn = true;
                model.replyOn = replyOn;
            }


        }

        function addReply(review, reply) {
            review.reply = reply;
            reviewService.updateReview(review._id, review).then(function (response) {
                $route.reload();
            });
        }

        function updateReply(review) {
            reviewService.updateReview(review._id, review).then(function (response) {
                $route.reload();
            });
        }

        function deleteReply(review) {
            review.reply = "";
            reviewService.updateReview(review._id, review).then(function (response) {
                $route.reload();
            });
        }

        function updateOffer(newVenue) {
            if(newVenue === undefined || newVenue.offerTitle === undefined || newVenue.offerText === undefined){
                model.errorMessage = "Enter all fields!";
            } else {
                venue.offerTitle = newVenue.offerTitle;
                venue.offerText = newVenue.offerText;
                venueService.updateVenue(vid, venue).then(function (response) {
                    $route.reload();
                })
            }
        }

        function deleteOffer() {
            venue.offerTitle = "";
            venue.offerText = "";
            venueService.updateVenue(vid, venue).then(function (response) {
                $route.reload();
            })

        }
    }
})();
