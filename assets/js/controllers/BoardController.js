angular.module('appController')
    .controller("boardCtrl", function($scope){
        var vm = this;

        vm.bCreate = false;
        vm.title = '';
        vm.status  = 'Backlog';

        //set colors
        $scope.colours = [{
            name: "White",
            hex: "#FFF"
        },{
            name: "Red",
            hex: "#F21B1B"
        }, {
            name: "Blue",
            hex: "#1B66F2"
        }, {
            name: "Green",
            hex: "#07BA16"
        }];
        $scope.colour = "";

        $scope.saved = localStorage.getItem('dashboards');
        $scope.dashboards = (localStorage.getItem('dashboards')!==null) ? JSON.parse($scope.saved) :
            [ {title: 'Learn AngularJS', status: 'Backlog'}, {title: 'Build an Angular app', status: 'In Progress'}, {title: 'Mobile Application', status: 'Done'} ];
        localStorage.setItem('dashboards', JSON.stringify($scope.dashboards));

        vm.actions = {
            'addToBoards':function(){
                $scope.dashboards.push({
                    title: vm.title,
                    status: vm.status,
                });
                vm.title = ''; //clear the input after adding
                vm.team = ''; //clear the input after adding
                localStorage.setItem('dashboards', JSON.stringify($scope.dashboards));
                vm.bCreate = false;
            },

        }
    });