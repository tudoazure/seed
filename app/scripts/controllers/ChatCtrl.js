(function (angular){
	"use strict;"
	angular.module('bargain')
		.controller('ChatCtrl', ['$scope', '$rootScope', 'ChatCoreService', 'UtilService', '$filter',
			function ($scope, $rootScope, ChatCoreService, UtilService, $filter) {
				$scope.activeWindows = [];
    			$scope.contact = $rootScope.plustxtcacheobj.contact;
    			$scope.products = $rootScope.plustxtcacheobj.products;
    			$scope.agentId = $rootScope.tigoId;
    			$scope.$on('Active-User-Changed', function(event, activeUser){
    				$scope.activeChatUser = activeUser;
    			})
    			
				$rootScope.$on('ChatObjectChanged', function(event, chatObj){
					
					$scope.$apply(function(){
				        $scope.contact = chatObj.contact;
				        console.log($scope.contact);
				        $scope.allMessages = chatObj.message;
				        $scope.products = chatObj.products;
				        if($scope.activeWindows.length < Globals.AppConfig.ConcurrentChats){
					        angular.forEach($scope.allMessages, function(val, key){
					        	var contactExists = false;
					        	angular.forEach($scope.activeWindows, function(value, index){
					        		if (value.userId == key){
					        			value.messages =  val;
					        			contactExists = true;
					        		}
					        	});
					        	if(!contactExists){
					        		if($scope.activeWindows.length == 0){
						        		$scope.activeChatUser = key;
						        	}
						        	var converstion = {};
						        	converstion.userId = key;
						        	converstion.messages =  val;
						        	$scope.activeWindows.push(converstion);

					        	}
					        })
					    }
				    });
				});

				$scope.changeActiveWindow = function(user){
					if(user){
						$scope.activeChatUser = user.id;
						var isChatExist = $filter('filter')($scope.activeWindows, {userId : user.id}, true);
						if(isChatExist.length){
							return;
						}
						if($scope.activeWindows && $scope.activeWindows.length ==2){
							var minTime = '';
							var deactiveContact ="";
							angular.forEach($scope.activeWindows, function(value, index){
								var contactTime = $scope.contact[value.userId].lastActive;
								if(minTime){
									if(minTime > contactTime){
										minTime = contactTime;
										deactiveContact = value.userId;
									}
								}else{
									minTime = contactTime;
									deactiveContact = value.userId;
								}
							});
							angular.forEach($scope.activeWindows, function(value, index){
								if(value.userId == deactiveContact){
									var conversation = {};
						        	conversation.userId = user.id;
						        	conversation.messages =  $scope.allMessages[user.id];
						        	$scope.activeWindows[index] = conversation;
								}
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


