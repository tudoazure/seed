(function (angular){
  'use strict';
  angular.module('bargain')
    .directive('chatArea', ['UtilService', 'httpService', '$timeout', function(UtilService, httpService, $timeout) {
      return {
        restrict: 'EA',
        templateUrl: 'scripts/directives/chat-area/chat-area-template.html',
        scope: false,
        link: function(scope, element, attrs) {         
          scope.templates = scope.templates;
          scope.openDefaultTemplates = function(){
            scope.showPromo = false;
            scope.showProduct = false;
            scope.showTemplates = true;
          }

          scope.qty = 1;
          //date picker
          scope.promoType = 'percentage';
          scope.format = 'dd/MM/yyyy';
          scope.defaultDateForPromoCode = function() {
            var someDate = new Date();
            var numberOfDaysToAdd = Globals.AppConfig.DefaultPromoCodeValidity;  // For default date validity of promo code.
            someDate.setDate(someDate.getDate() + numberOfDaysToAdd); 
            scope.validDate = someDate;
          };
          scope.defaultDateForPromoCode();
          scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            scope.opened = true;
          };
          scope.toggleMin = function() {
            scope.minDate = (scope.minDate ) ? null : new Date();
          };
          scope.toggleMin();
          //date picker

          scope.closeUserChat = function(){
            console.log("Delete Chat from this user: ", scope.chatData.userId);
            scope.agentMessage = Globals.AppConfig.CloseChatMessage;
            scope.submitMessage(false);
          }
          scope.setFocus = function(){
            scope.$emit('Active-User-Changed', scope.chatData.userId);
          }
          scope.removeFocus = function(){
          }

          scope.userName = scope.contact[scope.chatData.userId].name;
          scope.messages = scope.chatData.messages;

          scope.openPromoWindow = function(){
            scope.showPromo = true;
            scope.showProduct = false;
            scope.showTemplates = false;
          };

          scope.closeWindow = function(){
            scope.showPromo = false;
            scope.showProduct = false;
            scope.showTemplates = false;
          };

          scope.showProductDetail = function(){
            scope.showProduct = true;
            scope.showPromo = false;
            scope.showTemplates = false;
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

          scope.getProductDetail = function(){
            var productUrl =  Globals.AppConfig.productUrl + scope.products[scope.chatData.userId].productId;
            var svc = httpService.callFunc(productUrl);
            svc.get().then(function(response){
              if (response) {
                console.log(response);
                scope.productD = response;
                scope.showProductDetail();
              }
            }, function(error){
              alert("Error occured in fetching the product details.")
              console.log(error);
            });
          };

          scope.JSON_stringify = function (s, emit_unicode)
          {
             var json = JSON.stringify(s);
             return emit_unicode ? json : json.replace(/[\u007f-\uffff]/g,
                function(c) { 
                  return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4);
                }
             );
          };
          
          scope.savePromo = function(){
            scope.agentMessage = '';
            var bargainPromo =  Globals.AppConfig.PromoCodeCreate;
            var promoObj = {};
            promoObj.action = scope.promoType;
            promoObj.value =  scope.promoType == 'percentage' ? scope.percentCap : scope.absoluteCap;
            promoObj.cap = scope.promoType == 'percentage' ? scope.capLimit : "";
            promoObj.qty = scope.qty;
            promoObj.freeshipping = scope.isFreeShiping;
            promoObj.product_id = scope.products[scope.chatData.userId].productId;
            promoObj.user_id = scope.products[scope.chatData.userId].userId;
            promoObj.valid_upto = new Date(scope.validDate).getTime();

            var discountVal = "";
            if(scope.promoType == 'percentage'){
              var discount = Math.round(scope.percentCap * scope.products[scope.chatData.userId].price)/100;
              discountVal = (discount > promoObj.cap) ?  promoObj.cap : discount ;
            }
            else{
              discountVal = scope.absoluteCap;
            }

            var svc = httpService.callFunc(bargainPromo);
            svc.post(promoObj).then(function(response){
              if (response) {
                var promoCodeData = {
                  message : response.success_message.trim().replace('${amount}', discountVal).replace("Code applied:" , "Use Code:"),
                  promocode : response.code,
                  validity : moment(response.valid_upto).format("MMM Do, h:mm a") ,
                  minQuantity : promoObj.qty
                } 
                var promoCodeMessage = {PRMCODE: promoCodeData} ;
                scope.agentMessage = UtilService.stringifyEmitUnicode(promoCodeMessage, true);
                scope.submitMessage(true);
                scope.showPromo = !scope.showPromo;
              }
            }, function(error){
              alert("Error occured in generating the promo code.")
              console.log(error);
            })
            
          };

          scope.submitTemplate = function(templateMessage){
            console.log(templateMessage);
            if(templateMessage){
              scope.agentMessage = templateMessage;
              scope.submitMessage(false);
              scope.closeWindow();
              // scope.showTemplates = !scope.showTemplates;
            }
          };

          scope.submitMessage = function(isPromoCode){
            if(scope.agentMessage.trim() != ""){
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
        }
    }]);
})(angular);