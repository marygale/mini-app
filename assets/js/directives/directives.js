app.directive("dropdown", function($rootScope) {
    return {
        restrict: "E",
        templateUrl: "src/templates/dropdown.html",
        scope: {
            placeholder: "@",
            list: "=",
            selected: "=",
            property: "@"
        },
        link: function(scope) {
            scope.listVisible = false;
            scope.isPlaceholder = true;

            scope.select = function(item) {
                scope.isPlaceholder = false;
                scope.selected = item;
            };

            scope.isSelected = function(item) {
                return item[scope.property] === scope.selected[scope.property];
            };

            scope.show = function() {
                scope.listVisible = true;
            };

            $rootScope.$on("documentClicked", function(inner, target) {
                console.log($(target[0]).is(".dropdown-display.clicked") || $(target[0]).parents(".dropdown-display.clicked").length > 0);
                if (!$(target[0]).is(".dropdown-display.clicked") && !$(target[0]).parents(".dropdown-display.clicked").length > 0)
                    scope.$apply(function() {
                        scope.listVisible = false;
                    });
            });

            scope.$watch("selected", function(value) {
                scope.isPlaceholder = scope.selected[scope.property] === undefined;
                scope.display = scope.selected[scope.property];
            });
        }
    }
});
app.directive('dragContainer', function () {
    return {
        restrict: 'A',
        controller: 'DragContainerController',
        controllerAs: 'dragContainer',
        link: function ($scope, $element, $attrs, dragContainer) {
            dragContainer.init($element);

            $element.on('dragstart', dragContainer.handleDragStart.bind(dragContainer));
            $element.on('dragend', dragContainer.handleDragEnd.bind(dragContainer));
            // $element.on('dragenter', dragContainer.handleDragEnter.bind(dragContainer));

            $scope.$watch($attrs.dragContainer, dragContainer.updateDragData.bind(dragContainer));
            $attrs.$observe('mimeType', dragContainer.updateDragType.bind(dragContainer));

            $attrs.$set('draggable', true);
        }
    };
});
app.directive('dropContainer', function ($document, $parse) {
    return {
        restrict: 'A',
        controller: 'DropContainerController',
        controllerAs: 'dropContainer',
        link: function ($scope, $element, $attrs, dropContainer) {
            var bindTo = function (event) {
                return function (e) {
                    return $scope.$apply(function () {
                        return dropContainer['handle' + event](e);
                    });
                };
            };

            var dragEnd = dropContainer.handleDragEnd.bind(dropContainer);
            var handleDragEnter = bindTo('DragEnter');
            var handleDragOver = bindTo('DragOver');
            var handleDragLeave = bindTo('DragLeave');
            var handleDrop = bindTo('Drop');


            dropContainer.init($element, $scope, {
                onDragEnter: $parse($attrs.onDragEnter),
                onDragOver: $parse($attrs.onDragOver),
                onDragLeave: $parse($attrs.onDragLeave),
                onDrop: $parse($attrs.onDrop)
            });

            $element.on('dragenter', handleDragEnter);
            $element.on('dragover', handleDragOver);
            $element.on('dragleave', handleDragLeave);
            $element.on('drop', handleDrop);

            $scope.$watch($attrs.accepts, dropContainer.updateMimeTypes.bind(dropContainer));

            $document.on('dragend', dragEnd);

            $scope.$on('$destroy', function () {
                $document.off('dragend', dragEnd);
            });
        }
    };
})
app.directive('dropTarget', function ($parse) {
        return {
            restrict: 'A',
            require: ['^dropContainer', 'dropTarget'],
            controller: 'DropTargetController',
            controllerAs: 'dropTarget',
            link: function ($scope, $element, $attrs, ctrls) {
                var dropContainer = ctrls[0];
                var dropTarget = ctrls[1];
                var anchor = $attrs.dropTarget || 'center';
                var destroy = dropContainer.removeDropTarget.bind(dropContainer, anchor);

                $element.addClass('drop-target drop-target-' + anchor);

                dropTarget.init($element, $scope, {
                    onDragEnter: $parse($attrs.onDragEnter),
                    onDragOver: $parse($attrs.onDragOver),
                    onDragLeave: $parse($attrs.onDragLeave),
                    onDrop: $parse($attrs.onDrop),
                });

                dropContainer.addDropTarget(anchor, dropTarget);

                $scope.$on('$destroy', destroy);
            }
        };
    })