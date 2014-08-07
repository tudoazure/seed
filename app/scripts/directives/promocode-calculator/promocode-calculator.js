(function (angular){
  'use strict';
  angular.module('bargain')
    .directive('promocodeCalculator', ['$timeout', function( $timeout) {
      return {
        restrict: 'EA',
        templateUrl: 'app/scripts/directives/promocode-calculator/promocode-calculator-template.html',
        // transclude:true,
        // replace: true,
        scope: false,
        link: function(scope, element, attrs) {
          }
        }
    }]);
})(angular);
