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
                controller: 'boardCtrl',
                controllerAs: 'bc',
            }).
            when('/phones/:phoneId', {
                templateUrl: 'partials/phone-detail.html',
                controller: 'PhoneDetailCtrl'
            }).
            otherwise({
                redirectTo: '/dashboard'
            });
    }]);
app.value('Status', [
    {name: 'Backlog'},
    {name: 'In Progress'},
    {name: 'Done'}
]);
angular.module('appController', []);
