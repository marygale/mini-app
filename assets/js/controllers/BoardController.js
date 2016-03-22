angular.module('appController')
    .controller("boardCtrl", function($scope, Status){
        var vm = this;

        vm.bCreate = false;
        vm.title = '';
        vm.defaultStat  = 'Backlog';

        vm.detailsVisible = true;
        vm.currentStoryId = null;
        vm.currentStory = null;
        vm.editedStory = {};
        vm.stories = [];

        vm.status = Status;

        $scope.show=false;
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





        /*$scope.saved = localStorage.getItem('dashboards');
        $scope.dashboards = (localStorage.getItem('dashboards')!==null) ? JSON.parse($scope.saved) : [];

        localStorage.setItem('dashboards', JSON.stringify($scope.dashboards));*/

        $scope.extractData = function(){
            return JSON.parse(localStorage.getItem("dashboards")) || [
                    {title: 'Learn AngularJS', status: 'Backlog'}, {title: 'Build an Angular app', status: 'In Progress'}, {title: 'Mobile Application', status: 'Done'}
                ];
        }
        $scope.dashboards = $scope.extractData();

        vm.actions = {
            'addToBoards':function(){
                $scope.dashboards.push({
                    title: vm.title,
                    status: vm.defaultStat
                });
                vm.title = ''; //clear the input after adding
                vm.team = ''; //clear the input after adding
                localStorage.setItem('dashboards', JSON.stringify($scope.dashboards));
                vm.bCreate = false;
            },
            'extractData':function(){
                return JSON.parse(localStorage.getItem("dashboards")) || [
                        {title: 'Learn AngularJS', status: 'Backlog'}, {title: 'Build an Angular app', status: 'In Progress'}, {title: 'Mobile Application', status: 'Done'}
                    ];
            },
            'loadJSONData': function(story){
                var jsonTodo = angular.toJson(story);

                if (jsonTodo != 'null') {
                    localStorage.setItem("dashboards", jsonTodo);
                }
            },
            'insertAdjacent': function (target, story, insertBefore) {
                if (target === story) return;

                var fromIdx = $scope.dashboards.indexOf(story);
                var toIdx   = $scope.dashboards.indexOf(target);

                if (!insertBefore) toIdx++;

                if (fromIdx >= 0 && toIdx >= 0) {
                    $scope.dashboards.splice(fromIdx, 1);

                    if (toIdx >= fromIdx) toIdx--;

                    $scope.dashboards.splice(toIdx, 0, story);

                    story.status = target.status;
                }
            },
            'finalizeDrop':  function (story) {
                    StoriesModel.update(story.id, story)
                        .then(function (result) {
                            $log.debug('RESULT', result);
                        }, function (reason) {
                            $log.debug('REASON', reason);
                        });
            },
            'toTrash':function(index){
                $scope.dashboards.splice(index, 1);
                localStorage.removeItem(index);
                vm.actions.loadJSONData($scope.dashboards);

            }
        }
    });