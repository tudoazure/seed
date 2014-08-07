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
          if(scope.products && scope.products[scope.activeChatUser]){
            scope.product = scope.products[scope.activeChatUser];
          }
          else{
            scope.product = {};
            scope.product.imageUrl = "";
            scope.product.description = "Product Information Not Available";
            scope.product.price = "500";
          }

          scope.discountPC = 0;
          scope.discountABS = 0;
          scope.discountType = "percentage";  
        }
      }
    }]);
})(angular);
