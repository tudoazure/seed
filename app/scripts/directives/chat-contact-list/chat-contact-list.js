(function (angular){
  'use strict';
  angular.module('bargain')
    .directive('chatContactList', ['$timeout', function( $timeout) {
      return {
        restrict: 'EA',
        templateUrl: 'app/scripts/directives/chat-contact-list/chat-contact-list-template.html',
        scope: false,
        link: function(scope, element, attrs) {
            scope.openchatview = function(user){
              scope.changeActiveWindow(user);
            };
          }
        }
    }]);
})(angular);
