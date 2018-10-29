(function () {
    angular
        .module("ExploreNow")
        .factory("userService", userService);
    function userService($http) {

        var api = {
            "findUserByCredentials": findUserByCredentials,
            "findUserByUserId": findUserByUserId,
            "findUserByUsername": findUserByUsername,
            "createUser": createUser,
            "updateUser": updateUser,
            "deleteUser": deleteUser,
            "findFollowingForUser": findFollowingForUser,
            "findFollowersForUser": findFollowersForUser,
            "followUser": followUser,
            "unfollowUser": unfollowUser,
            "login": login,
            "loggedin": loggedin,
            "logout": logout,
            "getAllUsers": getAllUsers
        };
        return api;

        function getAllUsers() {
            return $http.get("/api/users")
                .then(function (response) {
                    return response.data;
                });
        }

        function findUserByCredentials(username, password) {
            var url = "/api/user?username="+username+"&password="+password;
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function login(username, password) {
            var url = "/api/login";
            return $http.post(url, {username: username, password: password})
                .then(function (response) {
                    return response.data;
                }, function (response) {
                    return null;
                });
        }

        function loggedin() {
            return $http.get("/api/loggedin")
                .then(function (response) {
                    return response.data;
                })

        }

        function logout() {
            return $http.delete("/api/logout")
                .then(function (response) {
                    return response.data;
                })
        }

        function findUserByUserId(userId) {
            return $http.get("/api/user/"+userId)
                .then(function (response) {
                    return response.data;
                });
        }

        function findUserByUsername(username) {
            return $http.get("/api/user?username=" +username)
                .then(function (response) {
                    return response.data;
                });
        }

        function createUser(user) {
            var url = "/api/user";
            return $http.post(url,user)
                .then(function (response) {
                    return response.data;
                });
        }

        function updateUser(userId, user) {
            var url = "/api/user/"+userId;
            return $http.put(url, user)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteUser(userId) {
            return $http.delete("/api/user/"+userId)
                .then(function (response) {
                    return response.data;
                });
        }

        function findFollowingForUser(userId) {
            return $http.get("/api/user/"+userId+"/following")
                .then(function (response) {
                    return response.data;
                });

        }

        function findFollowersForUser(userId) {
            return $http.get("/api/user/"+userId+"/followers")
                .then(function (response) {
                    return response.data;
                });

        }

        function followUser(userId, followId) {
            return $http.post("/api/user/"+userId+"/following/"+followId)
                .then(function (response) {
                    return response.data;
                });
        }

        function unfollowUser(userId, followId) {
            return $http.delete("/api/user/"+userId+"/following/"+followId)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();