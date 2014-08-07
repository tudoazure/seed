(function (angular){
  'use strict';
  angular.module('bargain')
    .directive('chatContactList', ['$timeout', function( $timeout) {
      return {
        restrict: 'EA',
        templateUrl: 'app/scripts/directives/chat-contact-list/chat-contact-list-template.html',
        // transclude:true,
        // replace: true,
        scope: false,
        link: function(scope, element, attrs) {
            scope.openchatview = function(user){
              scope.changeActiveWindow(user);
            };
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
