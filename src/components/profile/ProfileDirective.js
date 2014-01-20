(function() {
  goog.provide('ga_profile_directive');

  goog.require('ga_profile_service');

  var module = angular.module('ga_profile_directive', [
    'ga_profile_service'
  ]);

  module.directive('gaProfile',
      function($rootScope, $compile, gaProfileService) {
        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'components/profile/partials/profile.html',
          scope: {
            options: '=gaProfileOptions'
          },
          link: function(scope, element, attrs) {
            var d3 = window.d3;
            var options = scope.options;
            var tooltipEl = element.find('.profile-tooltip');
            scope.coordinates = [0, 0];
            scope.unitX = '';

            var profile = gaProfileService(options);

            $rootScope.$on('gaProfileDataLoaded', function(ev, data) {
              var profileEl = angular.element(
                  profile.create(data)
              );
              $compile(profileEl)(scope);
              scope.unitX = profile.unitX;
              var previousProfileEl = element.find('.profile-inner');
              if (previousProfileEl.length > 0) {
                previousProfileEl.replaceWith(profileEl);
              } else {
                element.append(profileEl);
              }
              var areaChartPath = d3.select('.profile-area');
              attachPathListeners(areaChartPath);
            });

            $rootScope.$on('gaProfileDataUpdated', function(ev, data) {
              profile.update(data);
              scope.unitX = profile.unitX;
            });

            function attachPathListeners(areaChartPath) {
              areaChartPath.on('mousemove', function() {
                var path = d3.select(areaChartPath[0][0]);
                var pathEl = path.node();
                if (angular.isDefined(pathEl.getTotalLength)) {
                  var mousePos = d3.mouse(areaChartPath[0][0]);
                  var x = mousePos[0];

                  var pos = this.getPointAtLength(x);
                  var start = x;
                  var end = pos.x;
                  var accuracy = 5;
                  //TODO use binary search instead
                  for (var i = start; i > end; i += accuracy) {
                    pos = this.getPointAtLength(i);
                    if (pos.x >= x) {
                      break;
                    }
                  }

                  // Get the coordinate value of x and y
                  var xCoord = profile.domain.X.invert(x);
                  var yCoord = profile.domain.Y.invert(pos.y);
                  // Get the tooltip position
                  var positionX = profile.domain.X(xCoord) +
                      scope.options.margin.left;
                  var positionY = profile.domain.Y(yCoord) +
                      scope.options.margin.top;
                  tooltipEl.css({
                    left: positionX + 'px',
                    top: positionY + 'px'
                  });
                  scope.$apply(function() {
                    scope.coordinates = [xCoord, yCoord];
                  });
                }
              });

              areaChartPath.on('mouseover', function(d) {
                var path = d3.select(areaChartPath[0][0]);
                var pathEl = path.node();
                if (angular.isDefined(pathEl.getTotalLength)) {
                  tooltipEl.css({ display: 'block' });
                }
              });

              areaChartPath.on('mouseout', function(d) {
                var path = d3.select(areaChartPath[0][0]);
                var pathEl = path.node();
                if (angular.isDefined(pathEl.getTotalLength)) {
                  tooltipEl.css({ display: 'none' });
                }
              });
            }
          }
        };
      });
})();
