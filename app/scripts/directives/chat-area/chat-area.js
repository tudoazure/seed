(function (angular){
  'use strict';
  angular.module('bargain')
    .directive('chatArea', ['$timeout', function( $timeout) {
      return {
        restrict: 'EA',
        templateUrl: 'app/scripts/directives/chat-area/chat-area-template.html',
        // transclude:true,
        // replace: true,
        scope: false,
        link: function(scope, element, attrs) {
          scope.sendMessageClick = function(){
            var message = {
              can_forward: "true",
              delete_after: "-1",
              deleted_on_sender: "false",
              flags: 0,
              id: "",
              last_ts: "1407260564",
              mid: "purple37c8c6a8",
              receiver: "piayrq",
              sender: "fmpwrn",
              sent_on: "1407260564",
              state: -1,
              txt: scope.agentMessage
            }
            scope.messages.push(message);
            scope.agentMessage = "";
            scope.sendMessage(message, "piayrq@chat-staging.paytm.com" , "piayrq-chat-staging-paytm-com");
          }

          }
        }
    }]);
})(angular);