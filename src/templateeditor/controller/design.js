var component1 = {};
var componentInfo1 = {};
var template1;
(function (angular, _) {
    "use strict";

    var componentIdCounter = 0;

    function generateComponentId() {
        return --componentIdCounter;
    }

    angular
            .module("Cerberus.TemplateEditor")
            .controller("Cerberus.TemplateEditor.Controller.Design", [
                "$scope",
                "$rootScope",
                "templateEditorPath",
                "Cerberus.TemplateEditor.Localization",
                "Cerberus.TemplateEngine.Service.Template",
                "Cerberus.TemplateEngine.Service.Event",
                "Cerberus.TemplateEngine.Service.DataBag",
                "Cerberus.TemplateEngine.TemplateMode",
                "Cerberus.ModelFactory",
                EditDesignController
            ]);

    function EditDesignController($scope, $rootScope, templateEditorPath, Localization, TemplateService, EventService, DataBagService, TemplateModes, ModelFactory) {
        DataBagService.addData("TemplateMode", TemplateModes.editDesign);

        _.assign($scope, {
            localization: Localization,
            applicationBasePath: templateEditorPath,
            addComponentFromSubComponent: function (obj) {
                console.log('dropped sub from another');
                var components = DataBagService.getData("Template").components;
                var origParentComponent = _.find(components, function (c) {
                    //return obj.component.parentId.replace("TC", "") == c.id;
                    return obj.component.parentId == c.id;
                });

                var index = origParentComponent.components.indexOf(obj.component);
                origParentComponent.components.splice(obj.component, 1);
                obj.component.del = true;

                var cloneChild = [];
                //angular.copy(obj.component, cloneChild);
                console.log($scope);
                //console.log($rootScope);
                //debugger;
                if (!obj.parentComponent.components) {
                    obj.parentComponent.components = [];
                }
                //cloneChild.parentId = 'TC' + obj.parentComponent.id;
                //cloneChild.parentId = obj.parentComponent.id;
                obj.component.parentId = obj.parentComponent.id;
                obj.parentComponent.components.push(obj.component)

                // obj.component.parentId = obj.parentComponent.id;

                EventService.notify("Sub ComponentAdded", obj.component);
            },
            addComponentFromPlugin: function (componentInfo) {
                console.log('this is not grid may be text');

                var component = angular.extend(ModelFactory.instantiateModel("Cerberus.TemplateEngine.Model.Component"), componentInfo);
                angular.copy(componentInfo, componentInfo1);
                angular.copy(component, component1)
                component.id = component.creationGUID = generateComponentId();
                //console.log(DataBagService.getData("Template"));
                var components = DataBagService.getData("Template").components;
                template1 = components;
                var parentComponent = _.find(components, function (a) {
                    //return a.id == component.parentId.replace("TC", "")
                    return a.id == component.parentId;
                });
                //console.log('id is',id,"but parentId was",component.parentId)
                if (!parentComponent.components) {
                    parentComponent.components = [];

                }
                component.del = false;
                parentComponent.components.push(component);
                //components.push(component);
                EventService.notify("ComponentAdded", component);
                //$rootScope.$digest();
            },
            addGridComponentFromPlugin: function (componentInfo, elem) {
                console.log('This is grid')
                var component = angular.extend(ModelFactory.instantiateModel("Cerberus.TemplateEngine.Model.Component"), componentInfo);
                component.id = component.creationGUID = generateComponentId();
                //template1=(DataBagService.getData("Template"))
                DataBagService.getData("Template").components.push(component);
                //elem.append('<div>dfdf</div>')
                //EventService.notify("ComponentAdded", component);
                // $rootScope.$digest();
            },
            exit: function () {
                EventService.notify("ExitTemplateEditor");
            },
            save: function () {
                return TemplateService.saveTemplate(DataBagService.getData("Template"))
                        .then(function (template) {
                            DataBagService.addData("Template", template);
                            EventService.notify("InitializeTemplate", template);
                        });
            },
            saveExit: function () {
                this.save()
                        .then(function () {
                            $scope.exit();
                        });
            }
        });

        $scope.$on("$destroy", EventService.clear.bind(EventService));

        EventService.subscribe("AddComponentFromPlugin", $scope.addComponentFromPlugin);
        EventService.subscribe("AddGridComponentFromPlugin", $scope.addGridComponentFromPlugin);
        EventService.subscribe("AddComponentFromSubComponent", $scope.addComponentFromSubComponent);
    }
})(window.angular, window._);