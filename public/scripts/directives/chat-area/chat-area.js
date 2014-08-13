(function (angular){
  'use strict';
  angular.module('bargain')
    .directive('chatArea', ['UtilService', 'httpService', function(UtilService, httpService) {
      return {
        restrict: 'EA',
        templateUrl: 'scripts/directives/chat-area/chat-area-template.html',
        scope: false,
        link: function(scope, element, attrs) {
          //date picker
          scope.qty = 1;
          scope.promoType = 'percentage';
          scope.format = 'dd/MM/yyyy';
          scope.minDate =  new Date();
          scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            scope.opened = true;
          };
          //date picker

          scope.closeUserChat = function(){
            console.log("Delete Chat from this user: ", scope.chatData.userId);
            scope.agentMessage = '{"CLSCHAT" : "chat closed"}';
            scope.submitMessage(false);
            scope.$emit('Close-User-Chat', scope.chatData.userId);
          }
          scope.setFocus = function(){
            scope.$emit('Active-User-Changed', scope.chatData.userId);
          }
          scope.removeFocus = function(){
          }

          if(scope.products && scope.products[scope.chatData.userId]){
            scope.product = scope.products[scope.chatData.userId];
          }
          else{
            scope.product = {};
            scope.product.imageUrl = "";
            scope.product.description = "Product Information N/A";
            scope.product.price = "N/A";
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
          scope.$watch('promoType', function(value) {
            scope.capLimit = "";
            scope.percentCap = "";
            scope.absoluteCap = "";
          });
          scope.savePromo = function(){
            scope.agentMessage = '';
            var bargainPromo =  Globals.AppConfig.PromoCodeCreate;
            var promoObj = {};
            promoObj.action = scope.promoType;
            promoObj.value =  scope.promoType == 'percentage' ? scope.percentCap : scope.absoluteCap;
            promoObj.cap = scope.promoType == 'percentage' ? scope.capLimit : "";
            promoObj.qty = scope.qty;
            promoObj.freeshipping = scope.isFreeShiping;
            promoObj.product_id = scope.product.productId;
            promoObj.user_id = scope.product.userId;
            promoObj.valid_upto = new Date(scope.validDate).getTime();

            var discountVal = "";
            if(scope.promoType == 'percentage'){
              var discount = Math.round(scope.percentCap * scope.product.price)/100;
              discountVal = (discount > promoObj.cap) ?  promoObj.cap : discount ;
            }
            else{
              discountVal = scope.absoluteCap;
            }

            var svc = httpService.callFunc(bargainPromo);
            svc.post(promoObj).then(function(response){
              if (response) {
                var promoCodeData = {
                  message : response.success_message.trim().replace('${amount}', discountVal),
                  promocode : response.code,
                  validity : moment(response.valid_upto).format("MMM Do, h:mm a") ,
                  minQuantity : promoObj.qty
                } 
                var promoCodeMessage = {PRMCODE: promoCodeData} ;
                promoCodeMessage = JSON.stringify(promoCodeMessage);
                scope.agentMessage = promoCodeMessage;
                scope.submitMessage(true);
                scope.showPromo = !scope.showPromo;
              }
              //send message()
            }, function(error){
              alert("Error occured in generating the promo code.")
              console.log(error)
            })
            
          }

          scope.submitMessage = function(isPromoCode){
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
              isProductDetails : false,
              isPromoCode : isPromoCode
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