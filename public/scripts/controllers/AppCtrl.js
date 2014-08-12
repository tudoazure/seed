(function (angular){
	"use strict;"
	angular.module('bargain')
		.controller('AppCtrl', ['$scope', '$rootScope', 'AuthService', 'StropheService', 'ChatCoreService','$timeout',
			function ($scope, $rootScope, AuthService, StropheService, ChatCoreService, $timeout) {
				

				$scope.init =function(){
					$rootScope.bargainAgent = user;
					$rootScope.chatSDK = ChatCoreService.chatSDK;
					$rootScope.plustxtId = null;
					$rootScope.sessionid = null;
					$rootScope.tigoId = null;
					$rootScope.plustxtcacheobj = {};
					$rootScope.plustxtcacheobj.contact = {};
					$rootScope.plustxtcacheobj.message = {};
					$rootScope.plustxtcacheobj.products = {};
					$rootScope.plustxtcacheobj.visibleChatContacts = [];
					$rootScope.loginusername = null;
					$rootScope.password = null;
					$rootScope.usersCount = 0;
				};

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
					$rootScope.chatSDK.connection.addHandler($rootScope.chatSDK.ping_handler, null, "iq", null, "ping1"); 
				    $rootScope.chatSDK.connection.addHandler($rootScope.chatSDK.ping_handler_readACK, null, "iq", null, "readACK");   
				    var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
				    $rootScope.chatSDK.connection.sendIQ(iq, $rootScope.chatSDK.on_roster); 
				    
				    $rootScope.chatSDK.write_to_log("IQ for fetching contact information is send : " + iq);
				    $rootScope.chatSDK.connection.addHandler($rootScope.chatSDK.on_message, null, "message", "chat");
				};

				$scope.loginToChatServer = function(){
					AuthService.chatServerLogin.query({
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
					}, function failure(error){
						console.log("Error", error);
					})
				};

				$scope.init();
				$scope.loginToChatServer();

			}
    	]);
})(angular);