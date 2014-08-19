(function (angular){
	"use strict;"
	angular.module('bargain')
		.controller('AppCtrl', ['$scope', '$rootScope', 'ChatServerService', 'StropheService', 'ChatCoreService', 'TemplateService','UtilService', 'IntimationService', '$timeout',
			function ($scope, $rootScope, ChatServerService, StropheService, ChatCoreService, TemplateService, UtilService, IntimationService, $timeout) {
				

				$scope.init =function(){
					$rootScope.bargainAgent = user;
					$rootScope.chatSDK = ChatCoreService.chatSDK;
					$rootScope.plustxtId = null;
					$rootScope.sessionid = null;
					$rootScope.tigoId = null;
					$rootScope.resourceId = null;
					$rootScope.plustxtcacheobj = {};
					$rootScope.plustxtcacheobj.contact = {};
					$rootScope.plustxtcacheobj.message = {};
					$rootScope.plustxtcacheobj.products = {};
					$rootScope.loginusername = null;
					$rootScope.flashMessage = "";
					$rootScope.password = null;
					$rootScope.usersCount = 0;
				};

				$scope.logout = function(){
					if($rootScope.chatSDK && $rootScope.chatSDK.connection){
						$rootScope.chatSDK.connection.send($pres({"type": "unavailable"}));
						$rootScope.chatSDK.connection = null;
					}
					window.location=Globals.AppConfig.logoutUrl;
				};

				$rootScope.$on('ChatMultipleSession', function(event){
					$timeout(function(){
						$scope.chatConnectionStatus = "It seems you are logged in from another place. Going to logout";
						$scope.logout();
                	});
				});

				$rootScope.$on('StropheStatusChange', function(event, status, connection){
					$rootScope.chatSDK.connection = connection;
					$rootScope.stropheStatus = status;
					switch(status){
						case Strophe.Status.CONNECTING:
							$scope.chatConnectionStatus = "Connecting";
							break;
						case Strophe.Status.CONNECTED:
							$scope.chatConnectionStatus = "Connected";
							$scope.connectedState();
							break;
						case Strophe.Status.DISCONNECTING:
							break;
						case Strophe.Status.DISCONNECTED:
							$scope.init();
							$scope.loginToChatServer();
							break;
						case Strophe.Status.AUTHENTICATING:
							break;
						case Strophe.Status.CONNECTED:
							break;
						case Strophe.Status.CONNFAIL:
							$scope.chatConnectionStatus = "It seems you are logged in from another place. Going to logout";
							$scope.logout();
							break;
						case Strophe.Status.AUTHFAIL:
							break;
						case Strophe.Status.ATTACHED:
							break;
					}
					$timeout(function(){
						$scope.chatConnectionStatus = StropheService.connectionStatus(status);
                    });
				});

				$scope.connectedState = function(){
					$rootScope.chatSDK.kill = "No";

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
						$rootScope.tigoId = response.data['tego_id'];
						$rootScope.sessionid = response.data['session_id'];
						$rootScope.plustxtId = response.data['tego_id'] + "@" + Globals.AppConfig.ChatHostURI;
						$rootScope.password = response.data['password'] + response.data['tego_id'].substring(0, 3);
						StropheService.connection($rootScope.plustxtId, $rootScope.password);
						$scope.getMessageTemplates();
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
							$timeout(function(){
								$rootScope.templates = response.data['t_msgs'];
                    		});			
						}, function failure(error){
							console.log("Templates could not be loaded.")
						})
					}
				}

				$scope.agentPingBack = function(){
					IntimationService.agentPingBack.query({
						session_id : $rootScope.sessionid,
						t_chats : UtilService.getTotalActiveChatUsers(),
					}, function success(response){
						$timeout($scope.agentPingBack, 60000);
						console.log("Sucessfully Ping Back");		
					}, function failure(error){
						console.log("Error in Pinging Back Chat Server");	
					})
				}

				$scope.getFlashMessage = function(){
					IntimationService.flashMessage.query({
						session_id : $rootScope.sessionid
					}, function success(response){
						if(response && response.data && response.data['f_msg']){
						 if($rootScope.flashMessage != response.data['f_msg']){
						 	$scope.flashMessage = $rootScope.flashMessage = response.data['f_msg'];
						 	window.setTimeout(function(){
						 		console.log('clear message')
						 		$scope.flashMessage = $rootScope.flashMessage ='';
						 		$scope.$apply();
						 	}, 10000);
						 	// alert(response.data['f_msg']);
						 }
						}
						$timeout($scope.getFlashMessage, 60000);
						console.log("Sucessfully Flash Message Call");		
					}, function failure(error){
						console.log("Error in Flash Message Call");	
					})
				}

				$scope.init();
				$scope.loginToChatServer();
				

			}
    	]);
})(angular);