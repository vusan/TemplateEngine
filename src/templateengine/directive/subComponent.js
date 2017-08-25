(function (angular) {
    "use strict";

    angular
            .module("Cerberus.TemplateEngine")
            .directive("csSubComponent", ["$timeout",
                function ($timeout) {
                    return {
                        restrict: "E",
                        link: function (scope, element) {

                            var component = scope.comp;
                            console.log('subComp', component.id);
                            element.attr({
                                id: "TCS" + component.id,
                                class: component.name.toLowerCase() + " sub-grid"
                            });

                            //         $timeout(function () {
                            console.log('after timeout', element)
                            element.context
                                    //.addClass("animatable777")
                                    //.parent().parent().parent()
                                    .click(function (event) {
                                        console.log('clllk', element, scope);
                                        scope1 = scope;
                                        //angular.copy(scope,scope1);
                                        var clickedElement = angular.element(event.target);
                                        var elementTagName = event.target.tagName.toLowerCase();

                                        // Do not deselect components if the user is switching between resolutions
                                        if (clickedElement.hasClass("resolution")) {
                                            return;
                                        }

                                        var selectedElements = $("cs-sub-component.selected");
                                        if (!event.ctrlKey) {
                                            selectedElements
                                                    .removeClass("selected")
                                                    .resizable("destroy")
                                                    .draggable("destroy");
                                            selectedElements = [];
                                        }

                                        if (elementTagName === "cs-sub-component") {
                                            var isSelected = clickedElement.hasClass("selected");

                                            //toggle selected class on element
                                            clickedElement.toggleClass("selected", !isSelected);

                                            if (!isSelected) {
                                                selectedElements.push(clickedElement);
                                                TemplateEditorHelper.enableDraggable(clickedElement);
                                                TemplateEditorHelper.enableResizable(clickedElement);
                                            }
                                            else {
                                                clickedElement
                                                        .resizable("destroy")
                                                        .draggable("destroy");
                                            }
                                        }

                                        var selectedComponents = getComponentModels(selectedElements);
                                        EventService.notify("ComponentSelected", selectedComponents);
                                    });
                            //  },3000);


                        },
                        controller: [
                            "$scope",
                            "$controller",
                            function ($scope, $controller) {
                                $controller($scope.comp.componentType, {"$scope": $scope});
                            }
                        ]
                    };
                }
            ]);
})(window.angular);


/*
 (function (angular) {
 "use strict";
 
 angular
 .module("Cerberus.TemplateEngine")
 .directive("csSubComponent", [
 function () {
 return {
 restrict: "E",
 link: function (scope, element) {
 var component = scope.comp;
 
 element.attr({
 id: "TCS" + component.id,
 class: component.name.toLowerCase()
 });
 },
 
 controller: [
 "$scope",
 "$controller",
 function ($scope, $controller) {
 $controller($scope.comp.componentType, { "$scope": $scope });
 }
 ]
 };
 }
 ]);
 })(window.angular);
 */