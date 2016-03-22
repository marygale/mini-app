var app = angular.module('app', [
    'ngRoute',
    'ngAnimate',
    'appController'
]);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/dashboard', {
                templateUrl: 'src/templates/board.html',
                controller: 'boardCtrl'
            }).
            when('/phones/:phoneId', {
                templateUrl: 'partials/phone-detail.html',
                controller: 'PhoneDetailCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);
angular.module('appController', []);