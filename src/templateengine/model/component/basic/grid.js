(function (angular) {
  "use strict";

  angular
    .module("Cerberus.ModelFactory")
    .registerModel("Cerberus.TemplateEngine.Model.Grid", function () {
      this.name = "";
      this.id = 0;
      this.lastModifiedDateAsString = "";
      this.del=false;
      this.components = [];
    });
})(window.angular);