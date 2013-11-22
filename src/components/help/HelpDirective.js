(function() {
  goog.provide('ga_help_directive');

  goog.require('ga_help_service');

  var module = angular.module('ga_help_directive',
      ['ga_help_service']);

  /* Help Directive
   *
   * This directives places a help button into the html.
   * When clicked, the help is displayed in a popup
   *
   * The directive has one attribute for configuration:
   * ga-help="your-help-id". This help id is used to get
   * the corresponding html snippet from the help service.
   * You need to add your id to the help service
   *
   * Sample html:
   * <div ga-help="my-help-id"></div>
  */
  module.directive('gaHelp',
      function($document, gaHelpService, gaPopup) {
        var popupContent = '<div class="ga-help-content">' +
                             '<h2 ng-bind="options.rows[1]"></h2>' +
                             '<div ng-bind="options.rows[2]"></div>' +
                             '<img ng-src="{{options.rows[4]}}"/>' +
                           '</div>';
        var popup;

        return {
          restrict: 'A',
          scope: {
            helpId: '@gaHelp'
          },
          replace: true,
          templateUrl: 'components/help/partials/help.html',
          link: function(scope, element, attrs) {

            scope.displayHelp = function() {
              if (angular.isDefined(popup)) {
                popup.open();
              } else {
                var waitClass = 'metadata-popup-wait';
                var bodyEl = angular.element($document[0].body);
                bodyEl.addClass(waitClass);

                var promise = gaHelpService.get(scope.helpId);

                promise.then(function(res) {
                  bodyEl.removeClass(waitClass);
                  popup = gaPopup.create({
                    className: 'ga-help-popup',
                    destroyOnClose: false,
                    title: 'help',
                    content: popupContent,
                    rows: res.rows[0]
                  });
                  popup.open();
                }, function() {
                  bodyEl.removeClass(waitClass);
                  //FIXME: better error handling
                  var msg = 'No help found for id ' + scope.helpId;
                  alert(msg);
                });
              }
            };
          }
        };
      });
})();

