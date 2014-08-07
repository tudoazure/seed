(function (angular){
	"use strict;"
	angular.module('bargain')
		.controller('ChatCtrl', ['$scope', '$rootScope', 'ChatCoreService', 'UtilService',
			function ($scope, $rootScope, ChatCoreService, UtilService) {
				$scope.visibleContacts = $rootScope.plustxtcacheobj.visibleChatContacts;
				//$scope.allMessages = $rootScope.plustxtcacheobj.messages;
				$scope.activeWindows = [];
    			$scope.contact = $rootScope.plustxtcacheobj.contact;
    			$scope.products = $rootScope.plustxtcacheobj.products;
    			
				$rootScope.$on('ChatObjectChanged', function(event, chatObj){
					$scope.agentId = $rootScope.tigoId;
					$scope.$apply(function(){
				        $scope.contact = chatObj.contact;
				        //$scope.allMessages = chatObj.message;
				        $scope.products = chatObj.products;
				        $scope.visibleContacts = chatObj.visibleChatContacts;
				        angular.forEach(chatObj.visibleChatContacts, function(contact, order){
				        	var contactExists = false;
				        	angular.forEach($scope.activeWindows, function(value, index){
				        		if (value.userId == contact){
				        			value.messages = chatObj.message[contact];
				        			contactExists = true;
				        		}
				        	});
				        	if(!contactExists){
					        	var converstion = {};
					        	converstion.userId = contact;
					        	converstion.messages = chatObj.message[contact];
					        	$scope.activeWindows.push(converstion);
				        	}
				        })
				    });
				});

				$scope.openchatview = function(user){
					if(user){
						if($scope.activeWindows && $scope.activeWindows.length){
							angular.forEach($scope.activeWindows, function(value, index){

							});
						}
					}
				};

				$scope.sendMessage = function(body, jid, timeInMilliSecond, mid){
					if(body !== ""){
			            // var timeInMilliSecond = UtilService.getTimeInLongString();
			            // var strTimeMii = timeInMilliSecond.toString();
			            // var messageId = $rootScope.tigoId + "-c-" + strTimeMii;
			           // var mid = messageId.toString();
			            var message = $msg({to: jid, "type": "chat", "id": mid}).c('body').t(body).up().c('active', {xmlns: "http://jabber.org/protocol/chatstates"}).up()
			            .c('meta').c('acl', {deleteafter: "-1", canforward: "1", candownload: "1"});
		             	var to = Strophe.getDomainFromJid($rootScope.chatSDK.connection.jid);
             			var ping = $iq({to: to,type: "get",id: "ping1"}).c("ping", {xmlns: "urn:xmpp:ping"});
             			$rootScope.chatSDK.connection.send(ping);
             			UtilService.updateMessageStatus(mid, -1, Strophe.getNodeFromJid(jid), timeInMilliSecond);
			        }
				};

				$scope.parsedDate = function(ts){
					return UtilService.getLocalTime(ts);
				}
      }]);
})(angular);


