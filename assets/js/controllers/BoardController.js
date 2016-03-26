angular.module('appController')
    .controller("boardCtrl", function ($scope, Status, colours, ngDialog) {
        var vm = this;

        vm.archive = {
            show: false,
            class: '',
        }

        $scope.count = 0;
        $scope.statuses = Status;
        $scope.show = false;
        $scope.colours = colours;

        $scope.extractData = function () {
            return JSON.parse(localStorage.getItem("dashboards")) || [];
        }
        $scope.dashboards = $scope.extractData();

        //localStorage.clear();
        console.log($scope.dashboards);
        vm.actions = {
            'addToBoards': function () {
                angular.forEach(vm.card, function (section, name) {
                    vm.card[name] = section;
                });
                $scope.dashboards.push(vm.card);
                console.log($scope.dashboards);
                localStorage.setItem('dashboards', JSON.stringify($scope.dashboards));
                vm.actions.init();
            },
            'isEmptyStatus': function (status) {
                var empty = true;
                if ($scope.dashboards && status) {
                    $scope.dashboards.forEach(function (story) {
                        if (story.status === status) empty = false;
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
                var toIdx = $scope.dashboards.indexOf(target);

                if (!insertBefore) toIdx++;

                if (fromIdx >= 0 && toIdx >= 0) {
                    $scope.dashboards.splice(fromIdx, 1);

                    if (toIdx >= fromIdx) toIdx--;

                    $scope.dashboards.splice(toIdx, 0, story);
                    story.status = target.status;
                }
            },
            'finalizeDrop': function (story) {
                angular.forEach($scope.dashboards, function (section, idx) {
                    if ($scope.dashboards[idx].id == story.id) {
                        $scope.dashboards[idx].status = story.status
                        console.log('finalizeDrop ', $scope.dashboards);
                        localStorage.setItem('dashboards', JSON.stringify($scope.dashboards));
                    }
                });

            },
            'modalToggle': function (action, story, stat) {console.log('story.color ',story.color);
                if (action == 'edit') {
                    vm.card.title = story.title;
                    vm.card.color = story.color;
                    vm.card.id = story.id;
                    $scope.story = story;
                } else {
                    vm.actions.init();
                    vm.card.status = stat;
                }
                $scope.action = action;
                ngDialog.openConfirm({
                    template: 'src/templates/forms.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                })
                    .then(function () {
                        if (action == 'add') {
                            vm.actions.addToBoards();
                        } else if (action == 'edit') {
                            console.log('$scope.story ', $scope.story);
                            angular.forEach($scope.dashboards, function (section, idx) {
                                if ($scope.dashboards[idx]['id'] == story.id) {
                                    angular.forEach(vm.card, function (section, name) {
                                        $scope.dashboards[idx][name] = section;
                                    });
                                    console.log('edit ', $scope.dashboards[idx]);
                                    localStorage.setItem('dashboards', JSON.stringify($scope.dashboards));
                                }
                            });
                        }

                    }, function (value) {
                        console.log('rejected:' + value);

                    });
            },
            'deleteAllCardInColumn': function (story) {
                angular.forEach($scope.dashboards, function (section, name) {
                    if ($scope.dashboards[name].trash == story.trash) {
                        $scope.dashboards[name].trash = true;
                    }
                });
                localStorage.setItem('dashboards', JSON.stringify($scope.dashboards));
            },
            'toTrash': function (story, entireCol) {
                ngDialog.openConfirm({
                    template: 'modalDialogId',
                    className: 'ngdialog-theme-default'
                }).then(function () {
                    angular.forEach($scope.dashboards, function (section, name) {
                        if (entireCol) {
                            if ($scope.dashboards[name].status == story) {
                                $scope.dashboards[name].trash = true;
                            }
                        } else {
                            if ($scope.dashboards[name].id == story.id) {
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
            'init': function () {
                vm.card = {
                    id: vm.actions.generateId().new(),
                    title: 'Story #1',
                    trash: false,
                    color: colours[0]['name']
                }
                $scope.statuses = Status;

            },
            'generateId': function () {
                return {
                    new: function () {
                        return (Math.random().toString(16) + "000000000").substr(2, 8);
                    },
                    empty: function () {
                        return '';
                    }
                };
            },
            'showArchiveBox': function (show) {
                if (show == false) {
                    vm.archive.show = true;
                    vm.archive.class = 'opened';
                }
                if (show == true) {
                    vm.archive.show = false;
                    vm.archive.class = '';
                }
            },
            'superDelete': function () {
                ngDialog.openConfirm({
                    template: 'modalDialogId',
                    className: 'ngdialog-theme-default'
                }).then(function () {
                    for (var i = 0; i < $scope.dashboards.length; i++) {
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
            'checkArchive': function () {
                angular.forEach($scope.dashboards, function (section) {
                    if (section.trash == true) {
                        $scope.count += 1;
                    }

                });
                console.log('list ', $scope.count);
            }

        }
        vm.actions.init();
        vm.actions.checkArchive();
        vm.actions.isEmptyStatus();

    });