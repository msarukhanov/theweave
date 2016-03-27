app = angular.module("the_weave_app", [
        'ngRoute',
    ]);
    app.config(function ($routeProvider, $locationProvider) {
        $routeProvider
        .when("/", {
            templateUrl: '/templates/home.html', 
            controller: 'HomeCtrl'
        });
    });
    app.controller("MainCtrl", ['$http', '$scope', '$rootScope', '$routeParams', '$route', 
        function ($http, $scope, $rootScope, $routeParams, $route) {
            console.log("main ctrl");
        }
    ]);
    app.controller("HomeCtrl", ['$http', '$scope', '$rootScope', '$routeParams', '$route', 
        function ($http, $scope, $rootScope, $routeParams, $route) {
            console.log("home ctrl");
        }
    ]);
