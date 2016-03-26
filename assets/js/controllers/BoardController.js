angular.module('appController')
    .controller("boardCtrl", function($scope, Status, colours, ngDialog){
        var vm = this;

        vm.archive ={
            show : false,
            class: '',
        }

        $scope.count = 0;
        $scope.statuses = Status;
        $scope.show=false;
        $scope.colours = colours;

        $scope.extractData = function(){
            return JSON.parse(localStorage.getItem("dashboards")) || [
                    {id: '1', title: 'Learn AngularJS', status: 'Backlog', trash: false, color: colours[0]},
                    {id: '2', title: 'Build an Angular app Build an Angular app Build an Angular appBuild an Angular appBuild an Angular appBuild an Angular appBuild an Angular appBuild an Angular appBuild an Angular appBuild an Angular appBuild an Angular appBuild an Angular appBuild an Angular appBuild an Angular appBuild an Angular appBuild an Angular appBuild an Angular appBuild an Angular appBuild an Angular appBuild an Angular appBuild an Angular appBuild an Angular app', status: 'In Progress', trash: false, color:colours[1]},
                    {id: '3', title: 'Mobile Application', status: 'In Progress', trash: false, color:colours[2]},
                    {id: '4', title: 'Mobile Application1', status: 'Done', trash: false, color:colours[2]},
                    {id: '5', title: 'Mobile Application2', status: 'In Progress', trash: false, color:colours[2]},
                    {id: '6', title: 'Mobile Application3', status: 'In Progress', trash: false, color:colours[2]},
                    {id: '7', title: 'Mobile Application4', status: 'In Progress', trash: false, color:colours[2]},
                    {id: '8', title: 'Mobile Application5', status: 'In Progress', trash: false, color:colours[2]},
                    {id: '9', title: 'Mobile Application6', status: 'In Progress', trash: false, color:colours[2]},
                    {id: '10', title: 'Mobile Application7', status: 'Done', trash: false, color:colours[2]},
                    {id: '11', title: 'Mobile Application8', status: 'Done', trash: false, color:colours[2]},
                    {id: '12', title: 'Mobile Application9', status: 'Done', trash: false, color:colours[2]},
                    {id: '13', title: 'Mobile Application10', status: 'Done', trash: false, color:colours[2]},
                    {id: '14', title: 'Mobile Application11', status: 'Done', trash: true, color:colours[2]},
                    {id: '15', title: 'Mobile Application12', status: 'Done', trash: true, color:colours[2]},
                    {id: '16', title: 'Mobile Application13', status: 'Done', trash: true, color:colours[2]},
                    {id: '17', title: 'Mobile Application14', status: 'Done', trash: true, color:colours[2]},
                    {id: '18', title: 'Mobile Application15', status: 'Done', trash: true, color:colours[2]},
                    {id: '19', title: 'Mobile Application16', status: 'Done', trash: true, color:colours[2]},
                    {id: '20', title: 'Mobile Application17', status: 'Done', trash: true, color:colours[2]},
                    {id: '21', title: 'Mobile Application18', status: 'Done', trash: true, color:colours[2]}

                ];
        }
        $scope.dashboards = $scope.extractData();

       //localStorage.clear();


        console.log($scope.dashboards);
        vm.actions = {
            'addToBoards':function(){
                angular.forEach(vm.card,function(section, name) {
                        vm.card[name] = section;
                });
                $scope.dashboards.push(vm.card); console.log($scope.dashboards);
                localStorage.setItem('dashboards', JSON.stringify($scope.dashboards));
                vm.actions.init();
            },
            'isEmptyStatus' : function(status){
                var empty = true;
                if ($scope.dashboards) {
                    $scope.dashboards.forEach(function (story) {
                        if (story.status === status.name) empty = false;
                    });
                }

                return empty;
            },
            'changeStatus': function (story, status) {
                    story.status = status.name;
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
            'finalizeDrop': function(story){
                angular.forEach($scope.dashboards,function(section, idx){
                    if($scope.dashboards[idx].id == story.id){
                        $scope.dashboards[idx].status = story.status
                        console.log('finalizeDrop ', $scope.dashboards);
                       localStorage.setItem('dashboards', JSON.stringify($scope.dashboards));
                    }
                });

            },
            'modalToggle': function(action, story, stat){
                if(action== 'edit'){
                    vm.card.title = story.title;
                    vm.card.color = story.color;
                    vm.card.id    = story.id;
                    $scope.story  = story;
                }else{
                    vm.actions.init();
                    vm.card.status = stat;
                }
                $scope.action= action;
                ngDialog.openConfirm({
                    template: 'src/templates/forms.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                })
                    .then(function(){
                        if(action == 'add'){
                            vm.actions.addToBoards();
                        }else if(action == 'edit'){ console.log('$scope.story ',$scope.story);
                            angular.forEach($scope.dashboards,function(section, idx){
                                if($scope.dashboards[idx]['id'] == story.id){
                                    angular.forEach(vm.card,function(section, name) {
                                        $scope.dashboards[idx][name] = section;
                                    });
                                    console.log('edit ', $scope.dashboards[idx]);
                                    localStorage.setItem('dashboards', JSON.stringify($scope.dashboards));
                                }
                            });
                        }

                    }, function(value){
                        console.log('rejected:' + value);

                    });
            },
            'deleteAllCardInColumn': function(story){
                angular.forEach($scope.dashboards,function(section, name) {
                    if($scope.dashboards[name].trash == story.trash) {
                        $scope.dashboards[name].trash = true;
                    }
                });
                localStorage.setItem('dashboards', JSON.stringify($scope.dashboards));
            },
            'toTrash': function(story, entireCol){
                ngDialog.openConfirm({
                    template: 'modalDialogId',
                    className: 'ngdialog-theme-default'
                }).then(function () {
                    angular.forEach($scope.dashboards,function(section, name) {
                        if(entireCol){
                            if($scope.dashboards[name].status == story) {
                                $scope.dashboards[name].trash = true;
                            }
                        }else{
                            if($scope.dashboards[name].id == story.id) {
                                $scope.dashboards[name].trash = true;
                            }
                        }

                    });
                    vm.actions.checkArchive();
                    localStorage.setItem('dashboards', JSON.stringify($scope.dashboards));
                }, function () {
                    console.log('Modal promise rejected.');
                });
            },
            'init': function(){
                vm.card = {
                    id:    vm.actions.generateId().new(),
                    title: 'Story #1',
                    trash: false,
                    color: colours[0]['name']
                }
                $scope.statuses = Status;

            },
            'generateId': function(){
                return {
                    new: function() {
                            return (Math.random().toString(16)+"000000000").substr(2,8);
                    },
                    empty: function() {
                        return '';
                    }
                };
            },
            'showArchiveBox': function(show){
                if(show == false) {
                    vm.archive.show = true;
                    vm.archive.class = 'opened';
                }
                if(show == true) {
                    vm.archive.show = false;
                    vm.archive.class = '';
                }
            },
            'superDelete': function(){
                ngDialog.openConfirm({
                    template: 'modalDialogId',
                    className: 'ngdialog-theme-default'
                }).then(function () {
                    for (var i = 0; i < $scope.dashboards.length; i++){
                        if ($scope.dashboards[i].trash && $scope.dashboards[i].trash === true) {
                            $scope.dashboards.splice(i);
                            $scope.count = 0;
                        }
                    }

                    localStorage.setItem('dashboards', JSON.stringify($scope.dashboards));
                }, function () {
                    console.log('Modal promise rejected.');
                });

            },
            'checkArchive': function(){
                angular.forEach($scope.dashboards,function(section) {
                    if(section.trash == true) {
                        $scope.count+= 1;
                    }

                });
                console.log('list ',$scope.count);
            }

        }
        vm.actions.init();
        vm.actions.checkArchive();

    });