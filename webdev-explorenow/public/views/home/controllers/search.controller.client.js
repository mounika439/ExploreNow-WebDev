/**
 * Created by mounika.
 */
(function () {
    angular
        .module("ExploreNow")
        .controller("searchController", searchController);

    function searchController(userService, venueService, $rootScope, $location) {
        var model = this;

        model.newSearchVenueByName = newSearchVenueByName;
        model.newSearchVenueByLocation = newSearchVenueByLocation;
        model.searchVenueByName = searchVenueByName;
        model.searchVenueByLocation = searchVenueByLocation;


        var currentUser;

        function init() {

            if($location.search().type === "name"){
                searchVenueByName($location.search().location, $location.search().name);
                $rootScope.location = $location.search().location;
                $rootScope.name = $location.search().name;
                $rootScope.toggle = "name";
            } else if($location.search().type === "location"){
                searchVenueByLocation($location.search().category);
                $rootScope.category = $location.search().category;
                $rootScope.toggle = "location";
            }
            userService.loggedin()
                .then(function (user) {
                    if(user == 0){
                        currentUser = null;
                    } else {
                        currentUser = user;
                        model.currentUser = currentUser;
                    }
                });

            $rootScope.title = "Search";

        }

        init();

        function newSearchVenueByName(location, name) {
            $rootScope.location = location;
            $rootScope.name = name;
            $location.url("/search?type=name&location="+location+"&name="+name);
        }

        function newSearchVenueByLocation(category) {
            $rootScope.category = category;
            $location.url("/search?type=location&category="+category);
        }


        function searchVenueByName(location, name) {
            venueService.searchVenueByName(location, name)
                .then(function (response) {
                    $rootScope.result = response;
                })
        }

        function searchVenueByLocation(category) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                venueService.searchVenueByLocation(lat, lng, category)
                    .then(function (response) {
                        $rootScope.result = response;
                    });
            })
        }
    }
})();