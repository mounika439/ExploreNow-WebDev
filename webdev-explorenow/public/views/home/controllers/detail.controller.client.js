/**
 * Created by mounika.
 */

(function () {
    angular
        .module("ExploreNow")
        .controller("detailController", detailController);

    function detailController($rootScope, $routeParams, venueService, notificationService, userService, reviewService, $location, $route) {
        var model = this;

        //Event handles:
        model.logout = logout;
        model.bookmarkVenue = bookmarkVenue;
        model.unbookmarkVenue = unbookmarkVenue;
        model.createReview = createReview;
        model.updateReview = updateReview;
        model.deleteReview = deleteReview;
        model.checkIn = checkIn;

        var vid = $routeParams["vid"];
        var currentUser;
        var venue;
        var venueExists = false;
        var lat;
        var lng;
        var imageUrl;
        function init() {
            model.vid = vid;
            model.bookmarked = false;
            model.ExploreNow = false;
            model.isManager = false;

            venueService.findVenueByVenueId(vid).then(function (response) {
                if(!response){
                    venueService.searchVenueById(vid)
                        .then(function (response) {
                            venue = response.response.venue;
                            lat = venue.location.lat;
                            lng = venue.location.lng;
                            imageUrl = venue.bestPhoto.prefix +"300x300"+venue.bestPhoto.suffix;
                            model.imageUrl = imageUrl;
                            model.mapUrl = venueService.getMapImage(lat,lng);
                            venue.location = venue.location.formattedAddress;
                            venue.contact = venue.contact.formattedPhone;
                            venue.price = venue.price.currency;
                            venue.website = venue.url;
                            model.venue = venue;
                            $rootScope.title = venue.name;
                        });
                }
                else {
                    venue = response;
                    model.venue = venue;
                    lat = venue.lat;
                    lng = venue.lng;
                    model.imageUrl = venue.imageUrl;
                    model.mapUrl = venueService.getMapImage(lat,lng);
                    venueExists = true;
                    $rootScope.title = venue.name;
                }

                userService.loggedin()
                    .then(function (user) {
                        if(user == 0){
                            currentUser = null;
                        }
                        else {
                            model.loggedin = true;
                            model.uid = user._id;
                            currentUser = user;
                            model.user = currentUser;
                            if(currentUser.bookmarks.includes(vid)){
                                model.bookmarked = true;
                            }
                            if(currentUser._venue === vid){
                                model.isManager = true;
                            }
                            reviewService.findReviewByCredentials(user._id ,vid).then(function (response) {
                                model.userReview = response;
                            });
                        }
                    });
            });

            reviewService.findReviewsForVenue(vid).then(function (response) {
                model.reviews = response.reverse();
            });
        }

        init();

        function logout() {
            userService.logout()
                .then(function (response) {
                    $route.reload();
                });
        }

        function bookmarkVenue() {
            venueService.findVenueByVenueId(vid).then(function (response) {
                if(!response){
                    var newVenue = {_id: vid,
                        name: venue.name,
                        location: venue.location.formattedAddress,
                        rating: venue.rating,
                        ratingColor: venue.ratingColor,
                        contact: venue.contact.formattedPhone,
                        imageUrl: imageUrl,
                        price: venue.price.currency,
                        url: venue.url,
                        lat: lat,
                        lng: lng};
                    venueService.createVenue(newVenue);
                }
            });

            venueService.bookmarkVenue(currentUser._id, vid)
                .then(function (response) {
                    model.bookmarked = true;
                });

        }

        function unbookmarkVenue() {
            venueService.unbookmarkVenue(currentUser._id, vid)
                .then(function (response) {
                    model.bookmarked = false;
                });

        }

        function createReview(review) {

            venueService.findVenueByVenueId(vid).then(function (response) {
                if (!response) {
                    var newVenue = {
                        _id: vid,
                        name: venue.name,
                        location: venue.location.formattedAddress,
                        rating: venue.rating,
                        ratingColor: venue.ratingColor,
                        contact: venue.contact.formattedPhone,
                        imageUrl: imageUrl,
                        price: venue.price.currency,
                        url: venue.url,
                        lat: lat,
                        lng: lng
                    };
                    venueService.createVenue(newVenue);
                }
            });


            if (review === undefined || review.title === undefined || review.text === undefined || review.rating === undefined) {
                model.errorMessage = "Enter all fields!";
            } else {
                var notification = {type: "REVIEW", _user: currentUser._id, _venue: vid};

                notificationService.createNotification(notification);

                review._user = currentUser._id;
                review._venue = vid;
                review.venueName = venue.name;
                reviewService.createReview(review).then(function (response) {
                    $route.reload();
                });
            }
        }

        function updateReview(review) {
            reviewService.updateReview(review._id, review).then(function (response) {
                $route.reload();
            });
        }

        function deleteReview(id) {
            reviewService.deleteReview(id).then(function (response) {
                $route.reload();
            });
        }

        function checkIn() {
            var notification = {type: "CHECKIN", _user: currentUser._id, _venue: vid};

            notificationService.createNotification(notification);
            model.ExploreNow = true;
        }
    }
})();
