(function (angular){
  'use strict';
  angular.module('bargain')
    .directive('chatArea', ['UtilService', 'httpService', function(UtilService, httpService) {
      return {
        restrict: 'EA',
        templateUrl: 'app/scripts/directives/chat-area/chat-area-template.html',
        // transclude:true,
        // replace: true,
        scope: false,
        link: function(scope, element, attrs) {
          //date picker
          scope.format = 'dd/MM/yyyy';
          scope.minDate =  new Date();

          scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            scope.opened = true;
          };
          //date picker

          //scope.promocode = {};
          if(scope.products && scope.products[scope.chatData.userId]){
            scope.product = scope.products[scope.chatData.userId];
          }
          else{
            scope.product = {};
            scope.product.imageUrl = "";
            scope.product.description = "Product Information Not Available";
            scope.product.price = 500 * scope.$parent.activeWindows.length;
          }
          scope.userName = scope.contact[scope.chatData.userId].name;
          scope.messages = scope.chatData.messages;
          scope.openPromoWindow = function(){
            scope.showPromo = !scope.showPromo;
          };

          scope.setPromoType = function(type){
            scope.promoType= type;
          }

          scope.setFreeShip = function(){
            scope.isFreeShiping = !scope.isFreeShiping;
          }

          scope.savePromo = function(){
            scope.agentMessage = 'new Promo';
            var bargainPromo =  ChatPanelUser.apiUrl + "admin/promocode/bargain";
            var promoObj = {};
            promoObj.action = scope.promoType;
            promoObj.value =  scope.promoType == 'percentage' ? scope.percentCap : scope.absoluteCap;
            promoObj.cap = scope.promoType == 'percentage' ? scope.capLimit : '';
            promoObj.qty = scope.qty;
            promoObj.freeshipping = scope.isFreeShiping;
            promoObj.product_id = scope.product.id;
            promoObj.user_id = scope.userid;
            promoObj.valid_upto = scope.validDate;

            var svc = httpService.callFunc(url);
            svc.post(promoObj).then(function(response){
              if (response) {
                var promotext =  " USE PROMO CODE: " +response.code + " VALID TILL : " + UtilService.parseDateTime(response.valid_from) ;
                //   var promoCodeData = {message : message.trim(),
                //       promocode : response.code,
                //       validity : UtilService.parseDate(data.valid_upto) + " | " + UtilService.parseTime(data.valid_upto),
                //       minQuantity : minQty
                // };
                scope.agentMessage = promotext;
                scope.sendMessageClick();
              }
              //send message()
            }, function(error){

            })
            
          }

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