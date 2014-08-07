(function (angular){
  'use strict';
  angular.module('bargain')
    .directive('chatArea', ['UtilService', function(UtilService) {
      return {
        restrict: 'EA',
        templateUrl: 'app/scripts/directives/chat-area/chat-area-template.html',
        // transclude:true,
        // replace: true,
        scope: false,
        link: function(scope, element, attrs) {
          if(scope.products && scope.products[scope.chatData.userId]){
            scope.product = scope.products[scope.chatData.userId];
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
            var timeInMilliSecond = UtilService.getTimeInLongString();
            var strTimeMii = timeInMilliSecond.toString();
            var messageId = scope.agentId + "-c-" + strTimeMii;
            var mid = messageId.toString();

            var message = {
              can_forward: "true",
              delete_after: "-1",
              deleted_on_sender: "false",
              flags: 0,
              id: "",
              last_ts: strTimeMii.substring(0, 10),
              mid: mid,
              receiver: scope.chatData.userId ,
              sender: scope.agentId,
              sent_on: strTimeMii.substring(0, 10),
              state: 0,
              txt: scope.agentMessage,
              isProductDetails : false
            }
            scope.chatData.messages.push(message);
            var jId = scope.chatData.userId + "@" + Globals.AppConfig.ChatHostURI;
            scope.sendMessage(message, jId, timeInMilliSecond, mid);
            scope.agentMessage = "";
          }

          }
        }
    }]);
})(angular);