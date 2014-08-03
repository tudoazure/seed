(function (angular){
  'use strict';
  angular.module('bargain')
    .directive('chatContactList', ['$timeout', function( $timeout) {
      return {
        restrict: 'EA',
        templateUrl: 'app/scripts/directives/chat-contact-list/chat-contact-list-template.html',
        transclude:true,
        replace: true,
        scope: {
          contact: "="
        },
         link: function(scope, element, attrs) {
            console.log(scope.contact);
            scope.$watch('contact', function(newValue, oldValue) {
                if (newValue)
                    console.log("I see a contact change!");
            }, true);
        }
        }
    }]);
})(angular);
