(function() {
  goog.provide('ga_help_registry_service');

  var module = angular.module('ga_help_registry_service', []);

  function Help() {
    var registry = {};

    registry['help-print'] = {
      html: '<div style="overflow: auto; font-size: 9px">' +
          '<div class="imageClear"></div>' +
          '<dl class="imgLeft w495" ' +
          'style=" margin-bottom:0px; padding-bottom:1em;">' +
          '<dt class="img">' +
          '<img class="legende" src="http://www.geo.admin.ch/' +
          'internet/geoportal/en/' +
          'commons/help/viewer_help.parsys.75364.Image.png"' +
          'alt="Bild Icon" /></dt><dd class="img">The “Print” ' +
          'function enables you to produce ' +
          'portable document format (.pdf) files containing ' +
          'an extract of the main map and any ' +
          'background data, together with information such ' +
          'as the map scale. You can save ' +
          'these files and print them out. The “Print” ' +
          'button opens a dialogue box for your ' +
          'choice of scale of the A4 page to be downloaded ' +
          'and printed, independent of the scale ' +
          'of the map view on display. The printable area ' +
          'will be highlighted in red and can be ' +
          'moved with the mouse. The legend for selected ' +
          'thematic data-sets (layers) can also be ' +
          'printed separately by using the “i” button of the ' +
          'relevant layer. CAUTION: pdf files can ' +
          'occupy several megabytes (MB) which may take a ' +
          'considerable time to download if your ' +
          'Internet connection is slow.<br><br><b>Legend: ' +
          '</b>Legends of all active layer are added ' +
          'on the second page of the print out.<br><br>1. ' +
          'Resize the print area<br>2. Move the print ' +
          'area<br> 3. Rotate the print area (<b>Warning:</b>' +
          'the North will not appear anymore on the ' +
          'top of the printed page).</dd></dl></div>'
    };

    registry['help-mouseposition'] = {
      html: '<div style="overflow: auto; font-size: 9px">' +
          '<div class="imageClear"></div><dl class="imgLeft ' +
          'w171" style=" margin-bottom:0px; padding-bottom:' +
          '1em;"><dt class="img"><img class="legende" src="' +
          'http://www.geo.admin.ch//internet/geoportal/en/c' +
          'ommons/help/viewer_help.' +
          'parsys.80516.Image.png" alt="" /></dt><dd class=' +
          '"img">When the mouse cursor is on the map, its c' +
          'oordinates (in the national coordinate system) a' +
          're displayed below the main map window.</dd></dl>'
    };

    this.getHtml = function(id) {
      return registry[id].html;
    };
  };

  /**
   * The gaHelp service.
   *
   * The service provides the following functionality:
   *
   * - Allows the gaHelpDirective to get a html snipped
   *   for a given help-id
   *
   * At least, that's the idea :) How the html will be
   * created/generated/downloaded/maintained is not yet
   * defined.
   * Most probably, the html will be loaded from some
   * service...
   */
  module.provider('gaHelpRegistry', function() {
    this.$get = function() {
      var help = new Help();
      return help;
    };
  });
})();

