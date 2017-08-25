(function (angular, _) {
  "use strict";

  angular
    .module("Cerberus.TemplateEditor")
    .service("Cerberus.TemplateEditor.Service.DeviceResolution", function () {
      var availableResolutions = [
        {
          name: "Mobile",
          value: 640,
          icon: 'mobile'
        },
        {
          name: "Tablet",
          value: 768,
          icon:'tablet'
        },
      {
          name: "Desktop",
          value: 1025,
          icon:'desktop'
        }];

      this.getResolutions = function () {
        return _.clone(availableResolutions); //clone to prevent outside manipulation
      };
    });
})(window.angular, window._);