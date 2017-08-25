var scope1={};
(function (angular, _, $) {
  "use strict";

  function getComponentModels(selectedElements) {
    var result = new Array(selectedElements.length);

    _.forEach(selectedElements, function (element, index) {
      result[index] = angular.element(element).scope().component;
    });

    return result;
  }

  angular
    .module("Cerberus.TemplateEditor")
    .directive("csComponentselection", [
      "Cerberus.TemplateEngine.Service.Event",
      "Cerberus.TemplateEditor.Helper.TemplateEditor",
      function (EventService, TemplateEditorHelper) {
        return {
          restrict: "A",
          link: function (scope, element) {
              
              console.log("comp select called");
              console.log(element)
              var notThis=1;
              
              if(!notThis) {
var selected = $([]), offset = {top:0, left:0}; 

element.draggable({
    start: function(ev, ui) {
        if (element.hasClass("selected")){
            selected = $("cs-component.selected").each(function() {
               var el = $(this);
               el.data("offset", el.offset());
            });
        }
        else {
            selected = $([]);
            element.removeClass("selected");
        }
        offset = $(this).offset();
    },
    drag: function(ev, ui) {
        var dt = ui.position.top - offset.top, dl = ui.position.left - offset.left;
        // take all the elements that are selected expect $("this"), which is the element being dragged and loop through each.
        selected.not(this).each(function() {
             // create the variable for we don't need to keep calling $("this")
             // el = current element we are on
             // off = what position was this element at when it was selected, before drag
             var el = $(this), off = el.data("offset");
            el.css({top: off.top + dt, left: off.left + dl});
        });
    }
});

element.selectable();

// manually trigger the "select" of clicked elements
element.click( function(e){
    if (e.metaKey == false) {
        // if command key is pressed don't deselect existing elements
       element.removeClass("selected");
        element.addClass("selecting");
    }
    else {
        if (element.hasClass("selected")) {
            // remove selected class from element if already selected
            element.removeClass("selected");
        }
        else {
            // add selecting class if not
            element.addClass("selecting");
        }
    }
    
   // element.data("selectable")._mouseStop(null);
});

// starting position of the divs
var i = 0;
$("cs-component.selected").each( function() {
    $(this).css({
        top: i * 42 
    });
    i++;
});
    
              }

              if(notThis){
              
            element
              .addClass("animatable")
             // .parent()
              .click(function (event) {
                  console.log('clllk3456',element,scope);
          scope1 = scope;
          //angular.copy(scope,scope1);
                var clickedElement = angular.element(event.target);
                clickedElement=element;
                var elementTagName = event.target.tagName.toLowerCase();
console.log(elementTagName,'tag')
                // Do not deselect components if the user is switching between resolutions
                if (clickedElement.hasClass("resolution")) {
                  return;
                }

                var selectedElements = $("cs-component.selected");
                if (!event.ctrlKey) {
                  selectedElements
                    .removeClass("selected")
                    .resizable("destroy")
                    .draggable("destroy");
                  selectedElements = [];
                }

                if (elementTagName != "cs-sub-component") {
                  var isSelected = clickedElement.hasClass("selected");

                  //toggle selected class on element
                  clickedElement.toggleClass("selected", !isSelected);

                  if (!isSelected) {
                    selectedElements.push(clickedElement);
                    TemplateEditorHelper.enableDraggable(clickedElement);
                    TemplateEditorHelper.enableResizable(clickedElement);
                    //TemplateEditorHelper.enableSortable(clickedElement);
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
          }
        };
      }]);
})(window.angular, window._, window.jQuery);