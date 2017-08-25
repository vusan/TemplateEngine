var element1;
var scope1={};
(function (angular, _, $) {
  "use strict";

  function getComponentModels(selectedElements) {
    var result = new Array(selectedElements.length);

    _.forEach(selectedElements, function (element, index) {
      result[index] = angular.element(element).scope().comp;
    });

    return result;
  }

  angular
    .module("Cerberus.TemplateEditor")
    .directive("csSubComponentselection", [
      "Cerberus.TemplateEngine.Service.Event",
      "Cerberus.TemplateEditor.Helper.TemplateEditor",
      function (EventService, TemplateEditorHelper) {
        return {
          restrict: "A",
          link: function (scope, element) {
              console.log("comp select called");
              element1 = element;
            element
              .addClass("animatable")
             // .parent()
              .click(function (event) {
                  
                  event.stopPropagation();
                  console.log('clllk34567',element,scope);
          scope1 = scope;
          //angular.copy(scope,scope1);
                var clickedElement = angular.element(event.target);
                clickedElement=element;
                var elementTagName = event.target.tagName.toLowerCase();

                // Do not deselect components if the user is switching between resolutions
                if (clickedElement.hasClass("resolution")) {
                  return;
                }

                var selectedElements = $("cs-sub-component.selected");
                
//                element.parent('.relat').parent()
//                        .removeClass("selected")
//                    .resizable("destroy")
//                    .draggable("destroy");
                if (!event.ctrlKey) {
                  selectedElements
                    .removeClass("selected")
                    .resizable("destroy")
                    .draggable("destroy");
                  selectedElements = [];
                }

                if (elementTagName === "cs-sub-component" || 2==2) {
                  var isSelected = clickedElement.hasClass("selected");

                  //toggle selected class on element
                  clickedElement.toggleClass("selected", !isSelected);

                  if (!isSelected) {
                    selectedElements.push(clickedElement);
                    TemplateEditorHelper.enableSubDraggable(clickedElement);
                    TemplateEditorHelper.enableSubResizable(clickedElement);
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
          }
        };
      }]);
})(window.angular, window._, window.jQuery);