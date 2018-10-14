(function () {
    angular
        .module("ExploreNow")
        .controller("registerController", registerController)

    function registerController($location, userService, $rootScope) {
        var model = this;

        //Event handles:
        model.register = register;

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
                        if (!response) {
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
                        if (response) {
                            login(user);
                        }
                        return;
                    });
            }
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
