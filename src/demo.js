/**
 * THIS APP IS FOR DEMONSTRATION PURPOSES ONLY
 * BEST PRACTICES ARE NOT FOLLOWED
 */
(function (angular, $, _) {
    "use strict";

    angular
            .module("Demo", [
                "ui.router",
                "Cerberus.ModelFactory",
                "Cerberus.TemplateEngine",
                "Cerberus.TemplateEditor"
            ])
            .config([
                "$stateProvider",
                "$urlRouterProvider",
                "templateEditorPath",
                "Cerberus.ModelFactoryProvider",
                "Cerberus.TemplateEngine.Service.TemplateProvider",
                function ($stateProvider, $urlRouterProvider, templateEditorPath, ModelFactoryProvider, TemplateProvider) {
                    TemplateProvider.setProvider(ModelFactoryProvider.$get().getModelType("Cerberus.TemplateEngine.Service.TemplateLocalStorageProvider"));

                    $stateProvider
                            .state("demo", {
                                url: "/demo",
                                templateUrl: "demo.html",
                                controller: "Demo.Controller.Home"
                            })
                            .state("design", {
                                url: "/design/:id",
                                templateUrl: templateEditorPath + "view/design.html",
                                controller: "Demo.Controller.Design"
                            })
                            .state("view", {
                                url: "/view/:id",
                                templateUrl: "view.html",
                                controller: "Demo.Controller.View"
                            });

                    $urlRouterProvider.otherwise("/demo");
                }
            ])
            .controller("Demo.Controller.Home", [
                "$scope",
                "$http",
                "Cerberus.TemplateEngine.Service.Template",
                "Cerberus.ModelFactory",
                function ($scope, $http, TemplateService, ModelFactory) {
                    $http.get("template-presets.json")
                            .then(function (response) {
                                $scope.templatePresets = response.data.templatePresets;
                            });

                    TemplateService.getTemplates()
                            .then(function (templates) {
                                $scope.templates = templates;
                            });

                    $scope.addTemplate = function (templatePreset) {
                        var template;

                        if (templatePreset) {
                            template = angular.extend({}, templatePreset.data);
                            template.name = $scope.newTemplateName || templatePreset.name;
                        }
                        else {
                            template = ModelFactory.instantiateModel("Cerberus.TemplateEngine.Model.Template");
                            template.name = $scope.newTemplateName || "Template";
                        }

                        $scope.newTemplateName = "";

                        TemplateService.saveTemplate(template)
                                .then(function (savedTemplate) {
                                    $scope.templates.push(savedTemplate);
                                });
                    };

                    $scope.removeTemplate = function (template) {
                        var templateId = template.id;
                        TemplateService.removeTemplate(templateId)
                                .then(function () {
                                    _.remove($scope.templates, {id: templateId});
                                });
                    };
                }
            ])
            .controller("Demo.Controller.View", [
                "$scope",
                "$stateParams",
                "Cerberus.TemplateEngine.Service.Template",
                "Cerberus.TemplateEngine.Service.Event",
                function ($scope, $stateParams, TemplateService, EventService) {
                    var templateId = $stateParams.id || 0;
                    TemplateService
                            .getTemplate(templateId)
                            .then(function (template) {
                                $scope.templateCSS = generateCSS(template);
                                EventService.notify("InitializeTemplate", template);
                            });
                }
            ])
            .controller("Demo.Controller.Design", [
                "$scope",
                "$state",
                "$stateParams",
                "Cerberus.TemplateEngine.Service.Template",
                "Cerberus.TemplateEngine.Service.Event",
                "Cerberus.TemplateEngine.Service.DataBag",
                function ($scope, $state, $stateParams, TemplateService, EventService, DataBagService) {
                    EventService.subscribe("ExitTemplateEditor", function () {
                        $state.go("demo");
                    });

                    var templateId = $stateParams.id || 0;
                    TemplateService
                            .getTemplate(templateId)
                            .then(function (template) {
                                DataBagService.addData("Template", template);
                                EventService.notify("InitializeTemplate", template);
                            });
                    var a = {
                        "name": "Template",
                        "id": 5,
                        "visualProperties": "",
                        "createdDateAsString": "",
                        "lastModifiedDateAsString": "",
                        "components": [
                            {
                                "id": 1,
                                "friendlyName": "",
                                "name": "grid",
                                "visualProperties": "left:4.4%;top:151.5px;width:27.5%;height:92px",
                                "componentType": "Cerberus.TemplateEngine.Controller.Component.Basic.Grid",
                                "category": "basic",
                                "creationGUID": -1,
                                "class": "",
                                "content": {},
                                "components": [
                                    {
                                        "id": -5,
                                        "friendlyName": "",
                                        "name": "labelList",
                                        "visualProperties": "width:66.9%",
                                        "componentType": "Cerberus.TemplateEngine.Controller.Component.Gmail.LabelList",
                                        "category": "gmail",
                                        "creationGUID": -5,
                                        "class": "",
                                        "content": {},
                                        "parentId": 1,
                                        "del": false
                                    }
                                ]
                            },
                            {
                                "id": 2,
                                "friendlyName": "",
                                "name": "grid",
                                "visualProperties": "left:54.9%;top:0px;width:45%;height:64px",
                                "componentType": "Cerberus.TemplateEngine.Controller.Component.Basic.Grid",
                                "category": "basic",
                                "creationGUID": -2,
                                "class": "",
                                "content": {},
                                "components": [
                                    {
                                        "id": -6,
                                        "friendlyName": "",
                                        "name": "labelList",
                                        "visualProperties": "left:87px;top:41px",
                                        "componentType": "Cerberus.TemplateEngine.Controller.Component.Gmail.LabelList",
                                        "category": "gmail",
                                        "creationGUID": -6,
                                        "class": "",
                                        "content": {},
                                        "parentId": 4,
                                        "del": true
                                    },
                                    {
                                        "id": -3,
                                        "friendlyName": "",
                                        "name": "text",
                                        "visualProperties": "left:7.1%;top:-2px",
                                        "componentType": "Cerberus.TemplateEngine.Controller.Component.Basic.Text",
                                        "category": "basic",
                                        "creationGUID": -3,
                                        "class": "",
                                        "content": {
                                            "text": "this is the content2"
                                        },
                                        "parentId": 2,
                                        "del": true
                                    }
                                ]
                            },
                            {
                                "id": 3,
                                "friendlyName": "",
                                "name": "grid",
                                "visualProperties": "left:0%;top:0px;width:54.4%;height:64px",
                                "componentType": "Cerberus.TemplateEngine.Controller.Component.Basic.Grid",
                                "category": "basic",
                                "creationGUID": -3,
                                "class": "",
                                "content": {},
                                "components": []
                            },
                            {
                                "id": 4,
                                "friendlyName": "",
                                "name": "grid",
                                "visualProperties": "left:40.5%;top:214.5px;width:29.4%;height:92px",
                                "componentType": "Cerberus.TemplateEngine.Controller.Component.Basic.Grid",
                                "category": "basic",
                                "creationGUID": -7,
                                "class": "",
                                "content": {},
                                "components": [
                                    {
                                        "id": -8,
                                        "friendlyName": "",
                                        "name": "text",
                                        "visualProperties": "top:60px;width:172px;height:56px",
                                        "componentType": "Cerberus.TemplateEngine.Controller.Component.Basic.Text",
                                        "category": "basic",
                                        "creationGUID": -8,
                                        "class": "",
                                        "content": {
                                            "text": "this is the test text3"
                                        },
                                        "parentId": -7,
                                        "del": false
                                    },
                                    {
                                        "id": -6,
                                        "friendlyName": "",
                                        "name": "labelList",
                                        "visualProperties": "width:17%;height:31px",
                                        "componentType": "Cerberus.TemplateEngine.Controller.Component.Gmail.LabelList",
                                        "category": "gmail",
                                        "creationGUID": -6,
                                        "class": "",
                                        "content": {},
                                        "parentId": 4,
                                        "del": true
                                    }
                                ]
                            },
                            {
                                "id": 5,
                                "friendlyName": "",
                                "name": "grid",
                                "visualProperties": "left:33.6%;top:69.5px;width:46.8%;height:66px",
                                "componentType": "Cerberus.TemplateEngine.Controller.Component.Basic.Grid",
                                "category": "basic",
                                "creationGUID": -1,
                                "class": "",
                                "content": {},
                                "components": [
                                    {
                                        "id": -3,
                                        "friendlyName": "",
                                        "name": "text",
                                        "visualProperties": "left:7.1%;top:-2px",
                                        "componentType": "Cerberus.TemplateEngine.Controller.Component.Basic.Text",
                                        "category": "basic",
                                        "creationGUID": -3,
                                        "class": "",
                                        "content": {
                                            "text": "this is the content1"
                                        },
                                        "parentId": 2,
                                        "del": true
                                    }
                                ]
                            }
                        ],
                        "resolutions": [
                            {
                                "id": 2,
                                "resolutionValue": 480,
                                "name": "mobile",
                                "componentVisualProperties": {
                                    "1": "left:4.4%;top:151.5px;width:27.5%;height:92px",
                                    "2": "left:54.9%;top:0px;width:45%;height:64px",
                                    "3": "left:0%;top:0px;width:54.4%;height:64px",
                                    "4": "left:40.5%;top:214.5px;width:29.4%;height:92px",
                                    "5": "left:1.7%;top:330px;width:46.8%;height:64px",
                                    "-4": "left:-216px;top:-17px",
                                    "-5": "width:66.9%",
                                    "-6": "width:17%;height:31px",
                                    "-8": "top:60px;width:172px;height:56px",
                                    "-2": "left:2.9%;top:-9px;width:40.8%;height:145px",
                                    "-3": "left:7.1%;top:-2px"
                                }
                            },
                            {
                                "id": 3,
                                "resolutionValue": 768,
                                "name": "tablet",
                                "componentVisualProperties": {
                                    "1": "left:4.4%;top:151.5px;width:27.5%;height:92px",
                                    "2": "left:54.9%;top:0px;width:45%;height:64px",
                                    "3": "left:0%;top:0px;width:54.4%;height:64px",
                                    "4": "left:40.5%;top:214.5px;width:29.4%;height:92px",
                                    "5": "left:1.7%;top:330px;width:46.8%;height:64px",
                                    "-4": "left:-216px;top:-17px",
                                    "-5": "width:66.9%",
                                    "-6": "width:17%;height:31px",
                                    "-8": "top:60px;width:172px;height:56px",
                                    "-2": "left:2.9%;top:-9px;width:40.8%;height:145px",
                                    "-3": "left:7.1%;top:-2px"
                                }
                            },
                            {
                                "id": 1,
                                "resolutionValue": 1025,
                                "name": "desktop",
                                "componentVisualProperties": {
                                    "1": "left:4.4%;top:151.5px;width:27.5%;height:92px",
                                    "2": "left:54.9%;top:0px;width:45%;height:64px",
                                    "3": "left:0%;top:0px;width:54.4%;height:64px",
                                    "4": "left:40.5%;top:214.5px;width:29.4%;height:92px",
                                    "5": "left:33.6%;top:69.5px;width:46.8%;height:66px",
                                    "-4": "left:-216px;top:-17px",
                                    "-5": "width:66.9%",
                                    "-6": "width:17%;height:31px",
                                    "-8": "top:60px;width:172px;height:56px",
                                    "-2": "left:2.9%;top:-9px;width:40.8%;height:145px",
                                    "-3": "left:12.5%"
                                }
                            }
                        ]
                    };
                    //DataBagService.addData("Template", a);
                    //EventService.notify("InitializeTemplate", a);
                }
            ]);

    $(document).ready(function () {
        angular.bootstrap(document, ["Demo"]);
    });

    //For demo purposes only - should be served as a CSS file by the server instead
    function generateCSS(template) {
        var previousResolution;
        var generatedCSS = "";

        _.forEach(template.resolutions, function (resolution) {
            if (!previousResolution) {
                generatedCSS += String.format("@media(max-width:{0}px){", resolution.resolutionValue);
            }
            else {
                generatedCSS += String.format("@media(min-width:{0}px) and (max-width:{1}px){", previousResolution.resolutionValue + 1, resolution.resolutionValue);
            }

            var isFixedHeight = false;
            _.forIn(resolution.componentVisualProperties, function (visualProperties, componentId) {
                // Special case - Fixed height containers must be rendered as blocks
                // to allow for scrollbars
                isFixedHeight = visualProperties.indexOf("overflow:") >= 0;

                generatedCSS += String.format("#TC{0}{{1};{2}}", componentId, isFixedHeight ? "display:block" : "", visualProperties);
            });

            generatedCSS += "}";

            previousResolution = resolution;
        });

        return generatedCSS;
    }
})(window.angular, window.$, window._);