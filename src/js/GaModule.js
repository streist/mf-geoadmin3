(function() {
  goog.provide('ga');


  goog.require('ga_attribution');
  goog.require('ga_backgroundlayerselector');
  goog.require('ga_catalogtree');
  goog.require('ga_contextpopup');
  goog.require('ga_importkml');
  goog.require('ga_importwms');
  goog.require('ga_map');
  goog.require('ga_mouseposition');
  goog.require('ga_popup');
  goog.require('ga_share');
  goog.require('ga_scaleline');
  goog.require('ga_search');
  goog.require('ga_topic');
  goog.require('ga_timeselector');
  goog.require('ga_translation');
  goog.require('ga_feedback');
  goog.require('ga_geolocation');
  goog.require('ga_layermanager');
  goog.require('ga_tooltip');
  goog.require('ga_swipe');
  goog.require('ga_featuretree');
  goog.require('ga_measure');
  goog.require('ga_modal_directive');
  goog.require('ga_draggable_directive');
  goog.require('ga_placeholder_directive');
  goog.require('ga_collapsible_directive');

  goog.require('ga_importkml_controller');
  goog.require('ga_importwms_controller');
  goog.require('ga_main_controller');
  goog.require('ga_catalogtree_controller');
  goog.require('ga_mouseposition_controller');
  goog.require('ga_share_controller');
  goog.require('ga_print_controller');
  goog.require('ga_print_directive');
  goog.require('ga_translation_controller');
  goog.require('ga_topic_controller');
  goog.require('ga_feedback_controller');
  goog.require('ga_contextpopup_controller');
  goog.require('ga_search_controller');
  goog.require('ga_timeselector_controller');
  goog.require('ga_tooltip_controller');
  goog.require('ga_featuretree_controller');

  var module = angular.module('ga', [
    'ga_attribution',
    'ga_backgroundlayerselector',
    'ga_catalogtree',
    'ga_contextpopup',
    'ga_importkml',
    'ga_importwms',
    'ga_map',
    'ga_mouseposition',
    'ga_popup',
    'ga_share',
    'ga_scaleline',
    'ga_search',
    'ga_topic',
    'ga_timeselector',
    'ga_translation',
    'ga_feedback',
    'ga_layermanager',
    'ga_tooltip',
    'ga_swipe',
    'ga_featuretree',
    'ga_measure',
    'ga_modal_directive',
    'ga_draggable_directive',
    'ga_placeholder_directive',
    'ga_collapsible_directive',
    'ga_slider_directive',
    'ga_importkml_controller',
    'ga_geolocation',
    'ga_importwms_controller',
    'ga_main_controller',
    'ga_catalogtree_controller',
    'ga_mouseposition_controller',
    'ga_share_controller',
    'ga_print_controller',
    'ga_print_directive',
    'ga_translation_controller',
    'ga_topic_controller',
    'ga_feedback_controller',
    'ga_contextpopup_controller',
    'ga_search_controller',
    'ga_timeselector_controller',
    'ga_tooltip_controller',
    'ngAnimate',
    'ga_featuretree_controller'
  ]);

  module.config(function($translateProvider, gaGlobalOptions) {
    $translateProvider.useStaticFilesLoader({
      prefix: gaGlobalOptions.version + 'locales/',
      suffix: '.json'
    });
  });

})();
