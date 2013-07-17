(function() {
  goog.provide('ga_help_directive');

  goog.require('ga_help_registry_service');
  //Permalink dependency likely temporary only
  //it's to configure different help systems for testing
  goog.require('ga_permalink');

  var module = angular.module('ga_help_directive',
      ['ga_help_registry_service', 'ga_permalink']);

  /* Help Directive
   *
   * This directives places a help button (text, as of
   * now) into the html. When activated, the help
   * is displayed in either
   *
   *   - a modal windows (default)
   *   - a popover (help=popover in URL parameter list)
   *
   * The directive has one attribute for configuration:
   * ga-help="your-help-id". This help id is used to get
   * the corresponding html snippet from the help service.
   * You need to add your id to the help service
   *
   * Sample html:
   * <ga-help ga-help="my-help-id"></ga-help>
  */
  module.directive('gaHelp',
      ['gaHelpRegistry', 'gaPermalink',
        function(gaHelpRegistry, gaPermalink) {
          return {
            restrict: 'A',
            scope: {
              helpId: '@gaHelp'
            },
            replace: true,
            templateUrl: 'components/help/partials/help.html',
            link: function(scope, element, attrs) {
              var queryParams = gaPermalink.getParams();
              var modal = true;
              var showInPopover = function() {
                var popopt = {
                  placement: 'right',
                  html: true,
                  trigger: 'click',
                  content: gaHelpRegistry.getHtml(scope.helpId),
                  container: 'body'
                };
                $(element[0]).popover(popopt);
              };

              var showInModal = function() {
                var modopt = {
                  show: false
                };
                var modalEl = $('#ga-help-modal');
                var contentEl = $(modalEl).children('.modal-body')[0];

                $(modalEl).modal(modopt);

                element.bind('click', function() {
                  //as we share the modal dialog for all help elements,
                  //we have to set the HTML on each click (could be refined)
                  contentEl.innerHTML = gaHelpRegistry.getHtml(scope.helpId);
                  $(modalEl).modal('show');
                });
              };

              element.attr('id', scope.helpId);
              element.addClass('ga-help');

              if (queryParams.help === 'popover') {
                modal = false;
              }

              if (modal) {
                showInModal();
              } else {
                showInPopover();
              }
            }
          };
        }]);
})();

