'use strict';

/* Directives */
/*This was used to allow the markers added in AR view to be clickable*/
/*The AR mode markers were added in javascript using the content attribute in a html div*/
/*For some reason I could not set ng-clicks for html added this way. This directive that I found online solved this problem*/
appControllers.directive('dir', function($compile, $parse) {
    return {
      restrict: 'E',
      link: function(scope, element, attr) {
        scope.$watch(attr.content, function() {
          element.html($parse(attr.content)(scope));
          $compile(element.contents())(scope);
        }, true);
      }
    }
  });