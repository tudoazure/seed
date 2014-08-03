(function (angular){
  'use strict';
  angular.module('bargain')
    .directive('chatArea', ['$timeout', function( $timeout) {
      return {
        restrict: 'EA',
        templateUrl: 'app/scripts/directives/chat-contact-list/chat-area-template.html',
        // transclude:true,
        // replace: true,
        scope: false,
        link: function(scope, element, attrs) {
            // console.log(scope.contact);
            // scope.$watch('contact', function(newValue, oldValue) {
            //     console.log(newValue);
            //     if (newValue)
            //         console.log("I see a contact change!");
            // }, true);
          }
        }
    }]);
})(angular);