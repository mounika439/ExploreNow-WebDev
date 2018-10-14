/**
 * Created by mounika.
 */

(function () {
    angular
        .module("ExploreNow")
        .controller("registerManagerController", registerManagerController)

    function registerManagerController($routeParams, $location, userService, $rootScope, venueService) {
        var model = this;

        var vid = $routeParams["vid"];
        var venue;
        var username;
        var venueExists = false;
        var currentUser;
        var lat;
        var lng;
        var imageUrl;

        //Event handles:
        model.register = register;
        model.registerManager = registerManager;

        function init() {
            venueService.findVenueByVenueId(vid).then(function (response) {
                if(!response){
                    venueService.searchVenueById(vid)
                        .then(function (response) {
                            venue = response.response.venue;
                            lat = venue.location.lat;
                            lng = venue.location.lng;
                            venue.location = venue.location.formattedAddress;
                            imageUrl = venue.bestPhoto.prefix +"300x300"+venue.bestPhoto.suffix;
                            model.venue = venue;
                            model.venue._id = venue.id;
                            $rootScope.title = venue.name;
                        });
                }
                else {
                    venue = response;
                    model.venue = venue;
                    venueExists = true;
                    $rootScope.title = venue.name;
                }
            });

            userService.loggedin()
                .then(function (user) {
                    if(user == 0){
                        currentUser = null;
                    }
                    else {
                        model.loggedin = true;
                        model.uid = user._id;
                        currentUser = user;
                        model.currentUser = currentUser;
                    }
                });
        }
        init();

        function register(user) {
            if(user === undefined || user.password === undefined || user.username === undefined || user.verifyPassword === undefined){
                model.errorMessage = "Enter all fields!";
            } else {
                userService.findUserByUsername(user.username)
                    .then(function (response) {
                        var _user = response;
                        if (!_user) {
                            if (user.password === user.verifyPassword) {
                                var newUser = {
                                    username: user.username,
                                    password: user.password,
                                    role: "MANAGER",
                                    _venue: vid
                                };
                                return userService.createUser(newUser);
                            }
                            else {
                                model.error = "Passwords do not match!";
                            }
                        }
                        else {
                            model.error = "User already exists!";
                        }
                        return;
                    })
                    .then(function (response) {
                        var newUser = response;
                        if (venueExists) {
                            venue._manager = newUser._id;
                            venueService.updateVenue(vid, venue).then(function (response) {
                                if (newUser) {
                                    login(user);
                                }
                                return;
                            });
                        } else {
                            var newVenue = {
                                _id: vid,
                                name: venue.name,
                                location: venue.location.formattedAddress,
                                rating: venue.rating,
                                ratingColor: venue.ratingColor,
                                _manager: newUser._id,
                                imageUrl: imageUrl,
                                lat: lat,
                                lng: lng
                            };
                            venueService.createVenue(newVenue).then(function (response) {
                                if (newUser) {
                                    login(user);
                                }
                                return;
                            })
                        }

                    });
            }
        }

        function registerManager() {
            currentUser.role = "MANAGER";
            currentUser._venue = vid;
            userService.updateUser(currentUser._id, currentUser)
                .then(function (response) {
                    var newUser = response;
                    if(venueExists){
                        venue._manager = currentUser._id;
                        venueService.updateVenue(vid, venue).then(function (response) {
                            $location.url("/venue/"+vid);
                        });
                    } else {
                        var newVenue = {_id: vid,
                            name: venue.name,
                            location: venue.location.formattedAddress,
                            rating: venue.rating,
                            ratingColor: venue.ratingColor,
                            _manager: currentUser._id,
                            imageUrl: imageUrl,
                            lat: lat,
                            lng: lng};
                        venueService.createVenue(newVenue).then(function (response) {
                            $location.url("/venue/"+vid);
                        })
                    }

                });
        }

        function login(user) {
            userService.login(user.username, user.password)
                .then(function (response) {
                    var _user = response;
                    if(!_user){
                        model.errorMessage = "Wrong username or password!";
                    }
                    else {
                        $rootScope.currentUser = _user;
                        $location.url("user/");
                    }
                });

        }
    }
})();
