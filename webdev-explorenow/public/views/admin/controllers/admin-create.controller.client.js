/**
 * Created by mounika.
 */

(function () {
    angular
        .module("ExploreNow")
        .controller("adminCreateController", adminCreateController);

    function adminCreateController($location, userService, $rootScope) {
        var model = this;

        //Event handles:
        model.register = register;
        model.logout = logout;

        function init() {
            $rootScope.title = "Register";
        }

        init();

        function register(user) {
            if (user === undefined ||
                user.password === undefined ||
                user.username === undefined ||
                user.verifyPassword === undefined ||
                user.firstName === undefined ||
                user.lastName === undefined) {
                model.errorMessage = "Enter all fields!";
            } else {
                userService.findUserByUsername(user.username)
                    .then(function (response) {
                        _user = response;
                        if (!_user) {
                            if (user.password === user.verifyPassword) {
                                var newUser = {
                                    username: user.username,
                                    password: user.password,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    role: "USER"
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
                        newUser = response;
                        $location.url("/admin")
                        return;
                    });
            }

            function logout() {
                if ($rootScope.currentUser) {
                    delete $rootScope.currentUser;
                }
                $location.url("/login");
            }
        }
    }
})();
