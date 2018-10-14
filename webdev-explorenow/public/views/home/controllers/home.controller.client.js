(function () {
    angular.module("ExploreNow")
        .controller("homeController", homeController);

    function homeController($location, $rootScope, userService, venueService){
        var model = this;

        // Event handles:
        model.logout = logout;
        model.toggleSearch = toggleSearch;
        model.searchVenueByLocation = searchVenueByLocation;
        model.searchVenueByName = searchVenueByName;

        var currentUser;
        var toggle = "name";
        function init() {

            $rootScope.toggle = toggle;

            userService.loggedin()
                .then(function (user) {
                    if(user == 0){
                        currentUser = null;
                    } else {
                        currentUser = user;
                        model.currentUser = currentUser;
                    }
                });
            $rootScope.title = "ExploreNow";
        }
        init();

        function logout() {
            userService.logout()
                .then(function (response) {
                    model.currentUser = "";
                    $route.reload();
                });
        }

        function toggleSearch() {
            if(toggle == "name"){
                toggle = "location";
                $rootScope.toggle = toggle;
            } else {
                toggle = "name";
                $rootScope.toggle = toggle;
            }


        }

        function searchVenueByName(location, name) {
            $rootScope.location = location;
            $rootScope.name = name;
            $location.url("/search?type=name&location="+location+"&name="+name);
        }

        function searchVenueByLocation(category) {
            $rootScope.category = category;
            $location.url("/search?type=location&category="+category);
        }


    }
})();