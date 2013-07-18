(function() {
  goog.provide('ga_importkml_controller');

  var module = angular.module('ga_importkml_controller', [
    'ga_browsersniffer_service',
    'pascalprecht.translate'
  ]);


  module.controller('GaImportKmlController',
      ['$scope', '$http', '$log', '$translate', 'gaGlobalOptions', 'gaBrowserSniffer',
       function($scope, $http, $log, $translate, gaGlobalOptions, gaBrowserSniffer) {
         $scope.isIE9 = (gaBrowserSniffer.msie == 9);
         $scope.isIE = !isNaN(gaBrowserSniffer.msie);
         $scope.file = null;
         $scope.fileUrl = null;
         $scope.fileContent = null;
         $scope.userMessage = '';
         $scope.progress = 0;
         $scope.options = {
           proxyUrl: 'ogcproxy?url=',
           validationServiceUrl: 'http://www.kmlvalidator.org/validate.htm'
         };

         // Handle fileURL
         $scope.handleFileUrl = function() {
           var url = $scope.fileUrl;

           if (url && url.length > 0 && /^http/i.test(url)) {
             // info: Angular test the validation of the input too

             var proxyUrl = $scope.options.proxyUrl + encodeURIComponent(url);
             $scope.userMessage = $translate('uploading_file');
             $scope.progress = 0.1;


             // Angularjs doesn't handle onprogress event
             $http.get(proxyUrl)
            .success(function(data, status, headers, config) {
               $scope.userMessage = $translate('upload_succeed');
               $scope.fileContent = data;
               $scope.displayFileContent();
             })
            .error(function(data, status, headers, config) {
               $scope.userMessage = $translate('upload_failed');
               $scope.progress = 0;
               //$log.error('Display KML failed');
             });

           } else {
             alert($translate('drop_invalid_url') + url); 
           }
         };


         // Handle a FileList (from input[type=file] or DnD),
         // works only with FileAPI
         $scope.handleFileList = function(files) {

           var file = files[0];

           // Test the validity of the file
           if (!/\.kml$/g.test(file.name)) {
             alert($translate('file_is_not_kml'));
             return;
           }

           if (file.size > 20000000) {
             alert($translate('file_too_large'));
             return;
           }

           $scope.file = file;
           $scope.userMessage = $translate('reading_file');
           $scope.progress = 0.1;

           // Read the file
           var reader = new FileReader();
           reader.onprogress = $scope.handleReaderProgress;
           reader.onload = $scope.handleReaderLoadEnd;
           reader.onerror = $scope.handleReaderError;
           //reader.onabort = $scope.handleReaderAbort; 
           reader.readAsText(file);
         };

          // Callback when FileReader is processing
         $scope.handleReaderProgress = function(evt) {
           if (evt.lengthComputable) {
             $scope.$apply(function() {
               $scope.progress = (evt.loaded / evt.total) * 80;
             });
           }
         };

         // Callback when FileReader has finished
         $scope.handleReaderLoadEnd = function(evt) {
           $scope.$apply(function() {
             $scope.userMessage = $translate('read_succeed');
             $scope.fileContent = evt.target.result;
             $scope.displayFileContent();
           });
         };
        
         // Callback when FileReader has failed
         $scope.handleReaderError = function(evt) {
           $scope.$apply(function() {
             $scope.userMessage = $translate('read_failed');
             $scope.progress = 0;
           });
         };

         // Display the KML file content on the map
         $scope.displayFileContent = function() {
           $scope.userMessage = $translate('parsing_file');
           $scope.progress = 80;

           // Create vector layer
           var epsg4326 = ol.proj.get('EPSG:4326');
           var swissProjection = ol.proj.get('EPSG:21781');
           var vector = new ol.layer.Vector({
             source: new ol.source.Vector({
               projection: epsg4326
             })
           });

           // Add the layer
           $scope.map.addLayer(vector);

           // Parse the KML file
           var kml = new ol.parser.KML({
             maxDepth: 1,
             dimension: 2,
             extractStyles: true,
             extractAttributes: true
           });

           try {
             vector.parseFeatures($scope.fileContent, kml, swissProjection);
             $scope.userMessage = $translate('parse_succeed');
             $scope.progress += 20;
             $scope.map.on(['click'], function(evt) {
               $scope.map.getFeatures({
                 pixel: evt.getPixel(),
                 layers: [vector],
                 success: function(features) {
                   if (features) {
                     $log.log(features[0][0].values_);
                   }
                 }
               });
             });
           } catch (e) {
             $scope.userMessage = $translate('parse_failed') + e.message;
             $scope.progress = 0;
             $scope.map.removeLayer(kml);
           }

         };


         $scope.clearUserOutput = function() {
           $scope.userMessage = '';
           $scope.progress = 0;
         };

         $scope.cancel = function() {
           $scope.userMessage = $translate('operation_canceled');
           $scope.progress = 0;

           if ($scope.fileReader) {
             $scope.fileReader.abort();
           }

           // Cancel $http, how?
           // $http.cancel();
         };

         $scope.reset = function() {
           $scope.cancel();
           $scope.clearUserOutput();
           $scope.file = null;
           $scope.fileUrl = null;
           $scope.fileContent = null;
         };
       }]);
})();
