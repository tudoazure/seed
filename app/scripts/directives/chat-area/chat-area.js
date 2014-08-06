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
          if(scope.products && scope.products[scope.userId]){
            scope.product = scope.products[scope.userId];
          }
          else{
            scope.product = {};
            scope.product.imageUrl = "";
            scope.product.description = "Product Information Not Available";
            scope.product.price = "N/A";
          }
          scope.userName = scope.contact[scope.chatData.userId].name;
          scope.messages = scope.chatData.messages;
          scope.sendMessageClick = function(){
            var message = {
              can_forward: "true",
              delete_after: "-1",
              deleted_on_sender: "false",
              flags: 0,
              id: "",
              last_ts: "1407260564",
              mid: "purple37c8c6a8",
              receiver: scope.chatData.userId ,
              sender: scope.agentId,
              sent_on: "1407260564",
              state: -1,
              txt: scope.agentMessage,
              isProductDetails : false
            }
            scope.chatData.messages.push(message);
            var jId = scope.chatData.userId + "@" + Globals.AppConfig.ChatHostURI;
            scope.sendMessage(message, jId);
            scope.agentMessage = "";
          }

          }
        }
    }]);
})(angular);