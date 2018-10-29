(function () {
    angular
        .module("ExploreNow")
        .service("venueService", venueService);


    function venueService($http) {
        this.searchVenueByName = searchVenueByName;
        this.searchVenueById = searchVenueById;
        this.searchVenueByLocation = searchVenueByLocation;
        this.getMapImage = getMapImage;

        this.getAllVenues = getAllVenues;
        this.findVenueByVenueId = findVenueByVenueId;
        this.createVenue = createVenue;
        this.updateVenue = updateVenue;
        this.deleteVenue = deleteVenue;
        this.bookmarkVenue = bookmarkVenue;
        this.unbookmarkVenue = unbookmarkVenue;
        this.findVenuesForUser = findVenuesForUser;


        var FOURSQUARE_CLIENT_ID = "O0RQ5MCQRO0CXOWBQSSE5JXLLCO1M0L51NOEJH23YTNNX05B";

        var FOURSQUARE_CLIENT_SECRET = "3UGFREITEOYUFAT0I2FK0YDL2SHDPS0IQEDMAN1F2FOGSD3I";

        var GEO_API_KEY = "AIzaSyDmjkyUIuqFhtjJHInVo848M68jhB4fWxA";

        function searchVenueByName(location, name) {
            var url = "https://api.foursquare.com/v2/venues/search?near="+location+"&query="+name+"&intent=checkin&client_id="+FOURSQUARE_CLIENT_ID+"&client_secret="+FOURSQUARE_CLIENT_SECRET+"&v=20170801";
            return $http.get(url).then(function (response) {
                return response.data;
            });
        }

        function searchVenueById(id) {
            var url = "https://api.foursquare.com/v2/venues/"+id+"?client_id="+FOURSQUARE_CLIENT_ID+"&client_secret="+FOURSQUARE_CLIENT_SECRET+"&v=20170801";
            return $http.get(url).then(function (response) {
                return response.data;
            });
        }

        function searchVenueByLocation(lat, lng, categoryId) {
            var url = "https://api.foursquare.com/v2/venues/search?ll="+lat+","+lng+"&categoryId="+categoryId+"&intent=checkin&client_id="+FOURSQUARE_CLIENT_ID+"&client_secret="+FOURSQUARE_CLIENT_SECRET+"&v=20170801";;
            return $http.get(url).then(function (response) {
                return response.data;
            });
        }

        function getMapImage(lat, lng) {
            var url = "https://maps.googleapis.com/maps/api/staticmap?center="+lat+","+lng+"&zoom=15&size=2000x300&maptype=roadmap&markers=color:red|"+lat+","+lng+"&key="+GEO_API_KEY;
            return url;
        }


        function getAllVenues() {
            return $http.get("/api/venues")
                .then(function (response) {
                    return response.data;
                });
        }

        function findVenueByVenueId(venueId) {
            return $http.get("/api/venue/"+venueId)
                .then(function (response) {
                    return response.data;
                });
        }

        function createVenue(venue) {
            var url = "/api/venue";
            return $http.post(url,venue)
                .then(function (response) {
                    return response.data;
                });
        }

        function updateVenue(venueId, venue) {
            var url = "/api/venue/"+venueId;
            return $http.put(url, venue)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteVenue(venueId) {
            return $http.delete("/api/venue/"+venueId)
                .then(function (response) {
                    return response.data;
                });
        }

        function findVenuesForUser(userId) {
            return $http.get("/api/user/"+userId+"/bookmark")
                .then(function (response) {
                    return response.data;
                });

        }

        function bookmarkVenue(userId, venueId) {
            return $http.post("/api/user/"+userId+"/bookmark/"+venueId)
                .then(function (response) {
                    return response.data;
                });
        }

        function unbookmarkVenue(userId, venueId) {
            return $http.delete("/api/user/"+userId+"/bookmark/"+venueId)
                .then(function (response) {
                    return response.data;
                });
        }

    }
})();