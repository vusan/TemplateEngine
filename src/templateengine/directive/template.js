(function (angular) {
    "use strict";

    angular
            .module("Cerberus.TemplateEngine")
            .directive("csTemplate", [
                "Cerberus.TemplateEngine.Service.DataBag",
                function (DataBagService) {
                    return {
                        restrict: "E",
                        scope: {},
                        controller: [
                            "$scope",
                            "Cerberus.TemplateEngine.Service.Event",
                            "Cerberus.TemplateEngine.Service.PathResolver",
                            function ($scope, EventService, PathResolverService) {
                                $scope.template = DataBagService.getData("Template");

                                $scope.getComponentPath = function (component) {
                                   // debugger;
                                    return PathResolverService.resolve(String.format("view/component/{0}/{1}.html", component.category, component.name));
                                };

                                //The template is supplied from outside
                                EventService.subscribe("InitializeTemplate", function (template) {
                                    $scope.template = template;
                                });
                            }],
                        template: function (element, attributes) {
                            var isEditMode = (attributes.templateMode || "View") !== "View";
                            var nameAttribute = "";
                            var styleAttribute = "";

                            // TODO: Consider using decorator
                            if (isEditMode) {
                                nameAttribute = "friendly-name=\"{{component.friendlyName}}\" component-name=\"{{component.name}}\"";
                                styleAttribute = "ng-attr-style=\"{{component.visualProperties}}\"";
                            }
                            return String.format("<div class=\"objectx\" style=\"display: none; left: 602px;\"></div>\n\
 <div class=\"objecty\" style=\"display: block; top: 178px;\"></div>\n\
<cs-component cs-componentselection cs-grid-droppable cs-togglehiddenelements cs-autosizetemplate template-mode=\"editDesign\"  \n\
ng-repeat=\"component in template.components track by component.id\" class=\"grid {{component.hidden?'c-hidden':'c-show'}}\" \
              {0} {1} \
              ng-class=\"component.class\" \
              ng-include=\"::getComponentPath(component)\"></cs-component>",
                                    nameAttribute,
                                    styleAttribute);
                        }
                    };
                }
            ]);
})(window.angular);