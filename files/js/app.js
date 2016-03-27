app = angular.module("the_weave_app", [
    'ngRoute'
]);
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/", {
            templateUrl: '/templates/home.html',
            controller: 'HomeCtrl'
        });
});
app.controller("MainCtrl", ['$http', '$scope', '$rootScope',
    function ($http, $scope, $rootScope) {
        var initMain = function(userData) {
            // get Available Games
            // get Current Characters
            $rootScope.mainLoadingProcess = false;
        };
        $rootScope.userData = {
            isLog : false
        };
        $rootScope.mainLoadingProcess = true;
        $rootScope.getUser = function() {
            $http({
                url: "/getUser",
                method: "GET"
            }).success(function (data) {
                if(data.error) {
                    $rootScope.mainLoadingProcess = false;
                }
                else {
                    $rootScope.userData = data;
                    $rootScope.userData.isLog = true;
                    initMain($rootScope.userData);
                }
            });
        };
    }
]);
app.controller("LoginCtrl", ['$http', '$scope', '$rootScope',
    function ($http, $scope, $rootScope) {
        $scope.errorText = false;
        $scope.loginData = {
            login : '',
            password : ''
        };
        $scope.login = function() {
            $http({
                url: "/logIn",
                method: "POST",
                data: $scope.loginData
            }).success(function (data) {
                if(data.error) {
                    $scope.mainLoadingProcess = false;
                    $scope.errorText = data.msg;
                }
                else {
                    $scope.errorText = false;
                    $rootScope.getUser();
                }
            });
        }
    }
]);
app.controller("HomeCtrl", ['$http', '$scope', '$rootScope', '$routeParams', '$route',
    function ($http, $scope, $rootScope, $routeParams, $route) {
        console.log("home ctrl");
    }
]);
