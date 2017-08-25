var thisElem;
var thisComp;
(function (angular, $) {
    "use strict";

    angular
            .module("Cerberus.TemplateEditor")
            .directive("csGridDroppable", ["$compile",
                "Cerberus.TemplateEngine.Service.Event",
                function ($compile, EventService) {
                    return {
                        restrict: "A",
                        link: function (scope, element) {
                            //console.log('droppable grid callse')
                            //console.log(element.context.className)
                            //console.log(element.context.className.indexOf("grid")!=-1?".component-plugin":".droppable.component-plugin")
                            // console.log(scope,'scope')
                            element.droppable({
                                accept: ".component-plugin, cs-sub-component",
                                hoverClass: "highlight",
                                drop: function (event, ui) {
                                    console.log('drop')
                                    console.log('ev', event);
                                    console.log('ui', ui);
                                    console.log('elem', element);
                                    angular.copy(event.target, thisElem);
                                    var componentPluginInfo;
                                    var droppedElement;
                                    var x, y;

                                    componentPluginInfo = ui.draggable.data("component-plugin-info");
                                    console.log('itemid', itemId)
                                    var subComponentId;
                                    var category;
                                    var component = scope.component;
                                    if (componentPluginInfo) {
                                        category = "plugin";
                                        //componentPluginInfo.componentInfo.parentId = element.context.id
                                        componentPluginInfo.componentInfo.parentId = scope.component.id;
                                        droppedElement = $(this);
                                        x = ui.offset.left - droppedElement.offset().left + componentPluginInfo.cursorAt.left;
                                        y = ui.offset.top - droppedElement.offset().top + componentPluginInfo.cursorAt.top;
                                    } else {
                                        var itemId = ui.draggable.data('ui-draggable').element.context.id;
                                        console.log('itemId', itemId)
                                        if (itemId.search('TCS') != -1) {
                                            subComponentId = itemId.replace('TCS', '');
                                            category = "subComponent"
                                        } else if (itemId.search('TC') != -1) {
                                            category = "component";
                                        }
                                    }

                                    console.log('case is', category);
                                    switch (category) {
                                        case "subComponent":
                                            //debugger;
                                            var compScope = angular.element(document.getElementById(itemId)).scope();



//                                            var ownParent = _.find(component.components, function (c) {
//                                                return subComponentId == c.id
//                                            });
                                            // debugger;
                                            if (compScope.comp.parentId != (component.id)) {
                                                //debugger;
                                                EventService.notify("AddComponentFromSubComponent", angular.extend({
                                                    visualProperties: String.format("left:{0}px;top:{1}px;", ~~x, ~~y)
                                                    , component: compScope.comp, parentComponent: component}));
                                            } else {
                                                console.log('own parent', compScope.comp.parentId);
                                            }

                                            break;
                                        case "component":
                                            console.log("do nothing");
                                            break;
                                        case "plugin":

                                            EventService.notify("AddComponentFromPlugin", angular.extend(componentPluginInfo.componentInfo, {
                                                visualProperties: String.format("left:{0}px;top:{1}px;", ~~x, ~~y)
                                            }), element);
                                            break;

                                    }

                                }
                            })
                        }
                    };
                }
            ]);
})(window.angular, window.jQuery);