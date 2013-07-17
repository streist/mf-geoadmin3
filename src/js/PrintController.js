(function() {
  goog.provide('ga_print_controller');
  goog.require('ga_help');

  var module = angular.module('ga_print_controller', ['ga_help']);

  module.controller('GaPrintController',
    function($scope, gaGlobalOptions) {
      $scope.options = {
        printPath:  gaGlobalOptions.baseUrlPath + '/print',
        baseUrlPath:  gaGlobalOptions.baseUrlPath,
        serviceUrl: gaGlobalOptions.serviceUrl
      };
  });
})();
