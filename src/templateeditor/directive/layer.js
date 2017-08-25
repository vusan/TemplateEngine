(function (angular) {
    "use strict";

    angular
            .module("Cerberus.TemplateEditor")
            .directive("csLayer", [
                "Cerberus.TemplateEditor.Service.PathResolver",
                "Cerberus.TemplateEngine.Service.DataBag",
                function (PathResolverService, DataBagService) {
                    return {
                        restrict: "E",
                        scope: true,
                        templateUrl: PathResolverService.resolve("view/layer.html"),
                        link: function (scope, element) {
                            console.log('runned')
                            $("ul.nested_with_switc").sortable({
                                cursor: 'move',
                                toleranceElement: '> div',
                                item: 'li',
                                connectWith: 'ul.nested_with_switc',
                                handle: 'div',
                                placeholder: 'placeholder',
                            });

                            $("ul.nested_with_switc > li > ul").sortable({
                                cursor: 'move',
                                toleranceElement: '> div',
                                item: 'li',
                                handle: 'div',
                                connectWith: 'ul.nested_with_switc > li > ul',
                                placeholder: 'placeholder',
                                //remove: function (event, ui) {
                                //  console.log("remove");
                                //},
                                //over: function (event, ui) {
                                //  console.log("over inner list");
                                //}
                                update: function (event, ui) {

                                }
                            });
                            //TODO: Remove watch after single use

                        },
                        controller: [
                            "$scope",
                            "templateEditorPath",
                            "Cerberus.TemplateEditor.Localization",
                            "Cerberus.TemplateEngine.Service.Template",
                            function ($scope, templateEditorPath, localization, TemplateEngineService) {
                                $scope.localization = localization;
                                $scope.showHide = function (c) {
                                    if (c.hidden) {
                                        c.hidden = false;
                                    } else {
                                        c.hidden = true;
                                    }

                                }
                                $scope.template = DataBagService.getData("Template");
                            }
                        ]
                    };
                }
            ]);
})(window.angular);