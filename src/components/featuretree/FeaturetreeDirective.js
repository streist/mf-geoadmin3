(function() {
  goog.provide('ga_featuretree_directive');

  goog.require('ga_map_service');

  var module = angular.module('ga_featuretree_directive', [
    'ga_map_service',
    'pascalprecht.translate'
  ]);

  module.directive('gaFeaturetree',
      ['$timeout', '$http', '$q', '$translate', '$sce', 'gaLayers',
      function($timeout, $http, $q, $translate, $sce, gaLayers) {
        var index = 0;

        return {
          restrict: 'A',
          templateUrl: 'components/featuretree/partials/featuretree.html',
          scope: {
            options: '=gaFeaturetreeOptions',
            map: '=gaFeaturetreeMap'
          },
          link: function(scope, element, attrs) {
            index++;
            scope.index = index;

            var currentTopic;
            var timeoutPromise = null;
            var canceler = null;
            var map = scope.map;
            var view = map.getView();
            var featureTolerance = 1;
            var target = element.find('.target');

            target.on('show.bs.collapse', function() {
              scope.$apply(function() {
                cancel();
                scope.active = true;
                requestFeatures();
              });
            });

            target.on('hide.bs.collapse', function() {
              scope.$apply(function() {
                cancel();
                scope.active = false;
              });
            });

            var getLayersToQuery = function(layers) {
              var layerstring = '';
              map.getLayers().forEach(function(l) {
                  var id = l.get('id');
                  if (gaLayers.getLayer(id) &&
                      gaLayers.getLayerProperty(id, 'queryable')) {
                    if (layerstring.length) {
                      layerstring = layerstring + ',';
                    }
                    layerstring = layerstring + id;
                  }
              });
              //FIXME: remove this once services are ready
              if (layerstring != '') {
                layerstring += ',';
              }
              layerstring += 'ch.bfs.gebaeude_wohnungs_register';
              //end of FIXME
              return layerstring;
            };

            var cancel = function() {
              if (timeoutPromise !== null) {
                $timeout.cancel(timeoutPromise);
              }
              if (canceler !== null) {
                canceler.resolve();
              }
              scope.loading = false;
              canceler = $q.defer();
            };

            var updateTree = function(features) {
              var tree = {};
              var oldTree = scope.tree;
              if (features.results &&
                  features.results.length > 0) {

                angular.forEach(features.results, function(result) {
                  //FIXME once service is updated, remove the string
                  var layerId = result.attrs.layer ||
                            'ch.bfs.gebaeude_wohnungs_register';

                  if (!angular.isDefined(tree[layerId])) {
                    tree[layerId] = {
                      label: gaLayers.getLayer(layerId).label,
                      features: [],
                      // We want to keep the state
                      open: oldTree[layerId] ? oldTree[layerId].open : false
                    };
                  }

                  var node = tree[layerId];
                  node.features.push({
                    loading: false,
                    showInfo: false,
                    info: '',
                    id: result.attrs.id,
                    layer: layerId,
                    //FIXME once service is updated, remove the string
                    label: result.attrs.label || 'ch.astra.ivs-nat'
                  });
                });
              }
              scope.tree = tree;
            };

            var getUrlAndParameters = function(layersToQuery) {
              var size = map.getSize(),
                  extent = view.calculateExtent(size),
                  url = scope.options.searchUrlTemplate,
                  params = {
                    bbox: extent[0] + ',' + extent[2] +
                        ',' + extent[1] + ',' + extent[3],
                    searchText: '',
                    type: 'features',
                    features: layersToQuery,
                    callback: 'JSON_CALLBACK'
                  };
              url = url.replace('{Topic}', currentTopic);
              return {
                url: url,
                params: params
              };
            };

            var requestFeatures = function() {
              var layersToQuery = getLayersToQuery(),
                  req;
              if (layersToQuery.length) {
                req = getUrlAndParameters(layersToQuery);

                scope.loading = true;

                // Look for all features in current bounding box
                $http.jsonp(req.url, {
                  timeout: canceler.promise,
                  params: req.params
                }).success(function(features) {
                  updateTree(features);
                  scope.loading = false;
                }).error(function(reason) {
                  scope.tree = {};
                  scope.loading = false;
                });
              }
            };

            // Update the tree based on map changes. We use a timeout in
            // order to not trigger angular digest cycles and too many
            // updates. We don't use the permalink here because we want
            // to separate these concerns.
            var triggerChange = function() {
              if (scope.active) {
                cancel();
                timeoutPromise = $timeout(function() {
                  requestFeatures();
                  timeoutPromise = null;
                }, 300);
              }
            };

            scope.loading = false;
            scope.tree = {};

            scope.showFeatureInfo = function(feature) {
              var htmlUrl;
              //Load information if not already there
              if (feature.info == '') {
                feature.loading = true;
                htmlUrl = scope.options.htmlUrlTemplate
                          .replace('{Topic}', currentTopic)
                          .replace('{Layer}', feature.layer)
                          .replace('{Feature}', feature.id);
                $http.jsonp(htmlUrl, {
                  timeout: canceler.promise,
                  params: {
                    lang: $translate.uses(),
                    callback: 'JSON_CALLBACK'
                  }
                }).success(function(html) {
                  feature.showInfo = true;
                  feature.info = $sce.trustAsHtml(html);
                  feature.loading = false;
                }).error(function() {
                  feature.showInfo = false;
                  feature.info = '';
                  feature.loading = false;
                });
              } else {
                feature.showInfo = true;
              }
            };

            view.on('change', triggerChange);

            scope.$on('gaTopicChange', function(event, topic) {
              currentTopic = topic.id;
            });

          }
        };

      }]
  );
})();
