(function (angular, $, $compile) {
    "use strict";

    angular
            .module("Cerberus.TemplateEditor")
            .directive("csDroppable", [
                "Cerberus.TemplateEngine.Service.Event",
                function (EventService) {
                    return {
                        restrict: "A",
                        link: function (scope, element) {
                            element.droppable({
                                accept: ".droppable",
                                drop: function (event, ui) {
                                    console.log('ev', event);
                                    console.log('ui', ui);
                                    console.log('elem', element);
                                    var componentPluginInfo = ui.draggable.data("component-plugin-info");

                                    var droppedElement = $(this);
                                    var x = ui.offset.left - droppedElement.offset().left + componentPluginInfo.cursorAt.left;
                                    var y = ui.offset.top - droppedElement.offset().top + componentPluginInfo.cursorAt.top;

                                    EventService.notify("AddGridComponentFromPlugin", angular.extend(componentPluginInfo.componentInfo, {
                                        visualProperties: String.format("left:{0}px;top:{1}px;", ~~x, ~~y)
                                    }));
                                }
                            });
                            //console.log($compile,'comp');
                            //console.log('dropable called')
                            //$compile(element)(scope);
                        }
                    };
                }
            ]);
})(window.angular, window.jQuery);