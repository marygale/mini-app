var app = angular.module('app', [
    'ngRoute',
    'ngAnimate',
    'ngDialog',
    'appController'
]);

app.config(['$routeProvider', 'ngDialogProvider',
    function($routeProvider, ngDialogProvider) {
        $routeProvider.
            when('/boards', {
                templateUrl: 'src/templates/board.html',
                controller: 'boardCtrl',
                controllerAs: 'bc'
            })
            .otherwise({
                redirectTo: '/boards'
            });
        ngDialogProvider.setDefaults({
            className: 'ngdialog-theme-default',
            plain: false,
            showClose: true,
            closeByDocument: true,
            closeByEscape: true,
            appendTo: false,
            preCloseCallback: function () {
                console.log('default pre-close callback');
            }
        });
    }]);

app.run(function($rootScope) {
    angular.element(document).on("click", function(e) {
        $rootScope.$broadcast("documentClicked", angular.element(e.target));
    });
});

app.value('Status', [
    {name: 'Backlog'},
    {name: 'In Progress'},
    {name: 'Done'}
]);

/*app.value('Status', [ 'Backlog', 'In Progress', 'Done']);*/
app.value('colours', [ 'white', 'blue', 'red', 'green']);

angular.module('appController', []);
