(function (angular){
	"use strict;"
	angular.module('bargain')
		.controller('AppCtrl', ['$scope', '$rootScope', 'ChatServerService', 'StropheService', 'ChatCoreService', 'MessageService', 'TemplateService','UtilService', 'IntimationService', '$timeout',
			function ($scope, $rootScope, ChatServerService, StropheService, ChatCoreService, MessageService, TemplateService, UtilService, IntimationService, $timeout) {

				$scope.init =function(){
					$rootScope.bargainAgent = user;
					$rootScope.chatSDK = ChatCoreService.chatSDK;
					$rootScope.plustxtId = null;
					$rootScope.sessionid = $.jStorage.get("SESSIONID");
					//$rootScope.SID = $.jStorage.get("SID");
					$rootScope.tigoId = null;
					$rootScope.resourceId = null;
					$rootScope.plustxtcacheobj = {};
					$rootScope.plustxtcacheobj.contact = {};
					$rootScope.plustxtcacheobj.message = {};
					$rootScope.plustxtcacheobj.products = {};
					$rootScope.flashMessage = "";
					$rootScope.password = null;
					$rootScope.usersCount = 0;
					$rootScope.logoutRequestRaised = null;
					$rootScope.connectionGuid = UtilService.guid();
					console.log("$rootScope.connectionGuid", $rootScope.connectionGuid);
					$.jStorage.set("ConnectionGuid", $rootScope.connectionGuid);
				};

				// $scope.focusWindow = function(){

				// 	$(window).bind('blur', function(event) {
				// 		console.log("BLUR");
				// 		$rootScope.chatSDK.connection.pause();
    // 					// $rootScope.chatSDK.connection.disconnect();
				// 		$(window).bind('focus', function() { 
				// 			$rootScope.chatSDK.connection.resume();
				// 			//if($rootScope.connectionGuid !== $.jStorage.get("ConnectionGuid")){
				// 				// $rootScope.connectionGuid = UtilService.guid();
				// 				// var jid = $.jStorage.get("JID");
				// 	   //          var rid =  $.jStorage.get("RID");
				// 	   //          var sid = $.jStorage.get("SID");
				// 	   //          $rootScope.sessionid = $.jStorage.get("SESSIONID");
				// 				// StropheService.attachConnection(jid, sid, rid);
				// 			//}
				// 			$(window).unbind('focus');}
				// 		);
				// 	});
				// }

				$scope.logout = function(){
					try  {
						if(!$rootScope.logoutRequestRaised){
							IntimationService.agentLogoutRequest.query({
								session_id : $rootScope.sessionid
							}, function success(response){
								if(response.message == "success" && response.status === 0){
									$rootScope.$broadcast("Agent-Logout-Request");
								}
							}, function failure(error){
								MessageService.displayError("Logout request could not be made.");
							})
						}
						else{
							$rootScope.$broadcast("Agent-Logout-Request");
						}
					}
					catch(e){
						$scope.forceLogout("Logging Out.")
					}
				};

				$rootScope.$on('ChatMultipleSession', function(event){
					alert('ChatMultipleSession');
					var statusMessage = "It seems you are logged in from another place. Going to logout";
					$scope.forceLogout(statusMessage);
				});

				$scope.forceLogout = function(statusMessage){
					// $timeout(function(){
					// 	$scope.chatConnectionStatus = statusMessage;
					// 	if($rootScope.chatSDK && $rootScope.chatSDK.connection){
					// 		$rootScope.chatSDK.connection.send($pres({"type": "unavailable"}));
					// 		$rootScope.chatSDK.connection = null;
					// 	}
					// 	window.location=Globals.AppConfig.logoutUrl;
     //            	});
				};

				// $scope.watchRID = function(statusMessage){
				// 	$scope.$watch($rootScope.chatSDK.connection._proto.rid, function() {
				// 		   console.log("WATCH RID", $rootScope.chatSDK.connection._proto.rid)
				// 	});
				// }

				$rootScope.$on('StropheStatusChange', function(event, status, connection){
					console.log("CONNECTION DETAILS : ", connection);
					$rootScope.chatSDK.connection = connection;
					$rootScope.stropheStatus = status;

					switch(status){
						case Strophe.Status.CONNECTING:
							$scope.chatConnectionStatus = "Connecting";
							break;
						case Strophe.Status.CONNECTED:
							$scope.chatConnectionStatus = "Connected";
							$scope.connectedState();

							// $.jStorage.set("RID", connection._proto.rid);
					         $.jStorage.set("SID", connection._proto.sid);
					         $.jStorage.set("JID", connection.jid);
					   	 	 console.log("RIIIIIIIIID", $.jStorage.get("RID"));
		                     console.log("SIIIIIIIIID", $.jStorage.get("SID"));


							break;
						case Strophe.Status.DISCONNECTING:
							break;
						case Strophe.Status.DISCONNECTED:
							// $scope.init();
							// $scope.loginToChatServer();
							break;
						case Strophe.Status.AUTHENTICATING:
							break;
						case Strophe.Status.ERROR:
							$scope.init();
							$scope.loginToChatServer();
							break;
						case Strophe.Status.CONNFAIL:
							var statusMessage = "It seems you are logged in from another place. Going to logout."
							$scope.forceLogout(statusMessage);
							break;
						case Strophe.Status.AUTHFAIL:
							var statusMessage = "Invalid Credentials while logging to Chat Server. Going to logout."
							$scope.forceLogout(statusMessage);
							break;
						case Strophe.Status.ATTACHED:
							$rootScope.sessionid = $.jStorage.get("SESSIONID");
							$rootScope.tigoId = $.jStorage.get("TIGOID");
							$rootScope.plustxtId = $.jStorage.get("PLUSTXTID");
							$scope.connectedState();
							$.jStorage.set("RID", connection._proto.rid);
					         $.jStorage.set("SID", connection._proto.sid);
					         $.jStorage.set("JID", connection.jid);
					   	 	 console.log("RIIIIIIIIID", $.jStorage.get("RID"));
		                     console.log("SIIIIIIIIID", $.jStorage.get("SID")); 
							break;
					}
					$timeout(function(){
						$scope.chatConnectionStatus = StropheService.connectionStatus(status);
                    });
				});

				$scope.connectedState = function(){
					$scope.agentPingBack();
					$scope.getFlashMessage();
					$rootScope.chatSDK.connection.addHandler($rootScope.chatSDK.ping_handler, null, "iq", null, "ping1"); 
				    $rootScope.chatSDK.connection.addHandler($rootScope.chatSDK.ping_handler_readACK, null, "iq", null, "readACK");   
				    var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
				    $rootScope.chatSDK.connection.sendIQ(iq, $rootScope.chatSDK.on_roster); 
				    $rootScope.chatSDK.write_to_log("IQ for fetching contact information is send : " + iq);
				    $rootScope.chatSDK.connection.addHandler($rootScope.chatSDK.on_message, null, "message", "chat");
				};

				$scope.loginToChatServer = function(){
					ChatServerService.login.query({
						email : $rootScope.bargainAgent.email,
						access_token : $rootScope.bargainAgent.token,
						device_type : "web",
						device_id : navigator.userAgent,
						utype : "Normal",
						device_token : "TOKEN",
						device_detail : "none+details"
					}, function success(response){
						if(response && !response.status && response.data){
							$rootScope.tigoId = response.data['tego_id'];
							$rootScope.sessionid = response.data['session_id'];
							$rootScope.plustxtId = response.data['tego_id'] + "@" + Globals.AppConfig.ChatHostURI;
							$rootScope.password = response.data['password'] + response.data['tego_id'].substring(0, 3);
							StropheService.connection($rootScope.plustxtId, $rootScope.password);
							$scope.getMessageTemplates();

							//
							$.jStorage.set("SESSIONID", $rootScope.sessionid);
							$.jStorage.set("TIGOID", $rootScope.tigoId);
							$.jStorage.set("PLUSTXTID", $rootScope.plustxtId);
							$.jStorage.set("PASSWORD", $rootScope.password);


							StropheService.connection($.jStorage.get("PLUSTXTID"), $.jStorage.get("PASSWORD"));

						}
						else{
							$timeout(function(){
								$scope.chatConnectionStatus = "Not registered on chat server! Logging out..";
                    		});
						}
					}, function failure(error){
						$timeout(function(){
							$scope.chatConnectionStatus = "Connection Could not be made";
                    	});
					})
				};

				$scope.getMessageTemplates = function(){
					if($rootScope.sessionid && !$scope.templates){
						TemplateService.getMessageTemplates.query({
							session_id : $rootScope.sessionid
						}, function success(response){
							if(!response.status  && response.message == "success"){
								$timeout(function(){
									$rootScope.templates = response.data['t_msgs'];
	                    		});		
                    		}
                    		else if(response.status == 511){
                    			$rootScope.chatSDK.connection = null;
                    			$timeout(function(){
									$scope.chatConnectionStatus = "Not registered on chat server! Logging out..";
                    			});
                    		}
                    		else{
                    			MessageService.displayError("Some error occured while fetching templates.");
                    		}
						}, function failure(error){
							MessageService.displayError("Message Templates could not be loaded.");
						})
					}
				}

				$scope.agentPingBack = function(){
					IntimationService.agentPingBack.query({
						session_id : $rootScope.sessionid,
						t_chats : UtilService.getTotalActiveChatUsers(),
					}, function success(response){
						if(response.status == 511){
	            			$rootScope.chatSDK.connection = null;
	            			$timeout(function(){
								$scope.chatConnectionStatus = "Not registered on chat server! Logging out..";
	            			});
							$timeout(window.location=Globals.AppConfig.logoutUrl , 5000);

                    	}
                    	else{
							$timeout($scope.agentPingBack, Globals.AppConfig.AgentPingbackCallTime);
						}
						console.log("Sucessfully Ping Back");		
					}, function failure(error){
						MessageService.displayError("Error in Pinging Back Chat Server.");
						console.log("Error in Pinging Back Chat Server");	
					})
				}

				$scope.getFlashMessage = function(){
					IntimationService.flashMessage.query({
						session_id : $rootScope.sessionid
					}, function success(response){
						if(response && response.data && response.data['f_msg']){
							if($scope.flashMessage != response.data['f_msg']){
								$scope.flashMessage = response.data['f_msg'];
								if($scope.flashMessage){
								 	window.setTimeout(function(){
								 		$scope.$apply();
								 	}, Globals.AppConfig.FlashMessageVisibility);
								}
							}
						}
						$timeout($scope.getFlashMessage, Globals.AppConfig.FlashMessageCallTime);
						console.log("Sucessfully Flash Message Call");		
					}, function failure(error){
						MessageService.displayError("Error in Flash Message Service.");
					})
				}

				$scope.init();
				if(!$rootScope.sessionid){
					$scope.loginToChatServer();
				}
				else{
					// console.log("Attaching to old connection")
					// var jid = $.jStorage.get("JID");
		   //          var rid =  $.jStorage.get("RID");
		   //          var sid = $.jStorage.get("SID");
		   //          $rootScope.sessionid = $.jStorage.get("SESSIONID");
					// StropheService.attachConnection(jid, sid, rid);
					$rootScope.tigoId = $.jStorage.get("TIGOID");
					$rootScope.plustxtId = $.jStorage.get("PLUSTXTID");
					$rootScope.password = $.jStorage.get("PASSWORD");
					StropheService.connection($.jStorage.get("PLUSTXTID"), $.jStorage.get("PASSWORD"));
				}
				//$scope.focusWindow();	
			}
    	]);
})(angular);