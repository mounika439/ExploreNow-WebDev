(function () {
    angular
        .module("ExploreNow")
        .config(configuration);

    function configuration($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "views/home/templates/home.view.client.html",
                controller: "homeController",
                controllerAs: "model"})
            .when("/login", {
                templateUrl: "views/profile/templates/login.view.client.html",
                controller: "loginController",
                controllerAs: "model"})
            .when("/register", {
                templateUrl: "views/profile/templates/register.view.client.html",
                controller: "registerController",
                controllerAs: "model"})
            .when("/user", {
                templateUrl: "views/user/templates/user.view.client.html",
                controller: "userController",
                controllerAs: "model",
                resolve:{
                    user: loggedin
                }})
            .when("/user/edit", {
                templateUrl: "views/user/templates/user-edit.view.client.html",
                controller: "userEditController",
                controllerAs: "model",
                resolve:{
                    user: loggedin
                }})
            .when("/user/search", {
                templateUrl: "views/user/templates/user-list.view.client.html",
                controller: "userListController",
                controllerAs: "model",
                resolve:{
                    user: loggedin
                }})
            .when("/user/:uid", {
                templateUrl: "views/profile/templates/profile.view.client.html",
                controller: "profileController",
                controllerAs: "model"})
            .when("/search", {
                templateUrl: "views/home/templates/search.view.client.html",
                controller: "searchController",
                controllerAs: "model"})
            .when("/venue/:vid", {
                templateUrl: "views/home/templates/detail.view.client.html",
                controller: "detailController",
                controllerAs: "model"})
            .when("/register/:vid", {
                templateUrl: "views/manager/templates/register-manager.view.client.html",
                controller: "registerManagerController",
                controllerAs: "model"})
            .when("/venue/:vid/manage", {
                templateUrl: "views/manager/templates/detail-manager.view.client.html",
                controller: "detailManagerController",
                controllerAs: "model",
                resolve:{
                    user: loggedin
                }})
            .when("/admin", {
                templateUrl: "views/admin/templates/admin-home.view.client.html",
                controller: "adminHomeController",
                controllerAs: "model",
                resolve:{
                    user: loggedin
                }})
            .when("/admin/create", {
                templateUrl: "views/admin/templates/admin-create.view.client.html",
                controller: "adminCreateController",
                controllerAs: "model",
                resolve:{
                    user: loggedin
                }})
            .when("/admin/edit/:uid", {
                templateUrl: "views/admin/templates/admin-edit.view.client.html",
                controller: "adminEditController",
                controllerAs: "model",
                resolve:{
                    user: loggedin
                }})
    }

    function loggedin(userService, $q, $location) {
        var deferred = $q.defer();
        userService.loggedin()
            .then(function (user) {
                if(user == 0){
                    deferred.reject();
                    $location.url("/login");
                } else {
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }
})();
