(function (angular){
	"use strict;"
	angular.module('bargain')
		.controller('ChatCtrl', ['$scope', '$rootScope', 'ChatCoreService', 'ChatServerService', 'UtilService', '$filter', '$timeout',
			function ($scope, $rootScope, ChatCoreService, ChatServerService, UtilService, $filter, $timeout) {
				$scope.activeWindows = [];
    			$scope.contact = $rootScope.plustxtcacheobj.contact;
    			$scope.products = $rootScope.plustxtcacheobj.products;
    			$scope.templates = $rootScope.templates;
    			
    			$scope.$on('Active-User-Changed', function(event, activeUser){
    				$scope.activeChatUser = activeUser;
    			})

    			$scope.$on('Close-User-Chat', function(event, closeChatUser){		
    				$timeout(function(){
    					var closeChatUserIndex;
    					
    					if($scope.contact[closeChatUser].chatState != "closed"){
    						$scope.contact[closeChatUser].chatState = "closed";
    						var threadId = $scope.contact[closeChatUser].threadId;
	    					UtilService.chatClosed($rootScope.sessionid, closeChatUser, "",  threadId);
    					}
    					angular.forEach($scope.activeWindows, function(value, index){
    						if(value.userId ==closeChatUser){
    							closeChatUserIndex = index;
    						}
    					})
	    				$scope.activeWindows.splice(closeChatUserIndex, 1);
	    				delete $scope.allMessages[closeChatUser];
	    				delete $scope.contact[closeChatUser];
	    				delete $scope.products[closeChatUser];
	    				if($scope.activeWindows.length > 0){
	    					$scope.activeChatUser = $scope.activeWindows[0].userId;
	    				}


                    });
    			})
    			
				$rootScope.$on('ChatObjectChanged', function(event, chatObj){
					$scope.agentId = $rootScope.tigoId;
					$scope.templates = $rootScope.templates;
					$scope.$apply(function(){
				        $scope.contact = chatObj.contact;
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
						if($scope.activeWindows && $scope.activeWindows.length == Globals.AppConfig.ConcurrentChats){
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
			            var message = $msg({to: jid, "type": "chat", "id": mid}).c('body').t(body).up().c('active', {xmlns: "http://jabber.org/protocol/chatstates"}).up()
			            .c('meta').c('acl', {deleteafter: "-1", canforward: "1", candownload: "1"});
		             	var to = Strophe.getDomainFromJid($rootScope.chatSDK.connection.jid);
             			var ping = $iq({to: to,type: "get",id: "ping1"}).c("ping", {xmlns: "urn:xmpp:ping"});
             			$rootScope.chatSDK.connection.send(ping);
             			UtilService.updateMessageStatus(mid, -1, Strophe.getNodeFromJid(jid), timeInMilliSecond);
             			var jid_id = $rootScope.chatSDK.jid_to_id(jid);
             			var tigo_id = Strophe.getNodeFromJid(jid);
						$rootScope.chatSDK.send_Read_Notification(jid, jid_id, tigo_id);
			        }
				};

				$scope.parsedDate = function(ts){
					return UtilService.getLocalTime(ts);
				}

				$scope.getJsonParsedMesg = function(message){
					return JSON.parse(message);
				}

				$scope.getUnReadMessageCount = function(user){
					var userMessages = $filter('filter')($scope.allMessages[user.id], {sender : user.id, state : 0}, true);
					return userMessages.length;
	            };

				$scope.getMesgState = function(state){
					var messageState = "Sending";
					switch(state){
						case 0:
							messageState = "Received"
							break;
						case 1:
							messageState = "Sent"
							break;
						case 2:
							messageState = "Delievered"
							break;
						case 3:
							messageState = "Read"
							break;
					}
					return messageState;
				}
      }]);
})(angular);


