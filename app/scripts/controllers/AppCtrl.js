(function (angular){
	"use strict;"
	angular.module('bargain')
		.controller('AppCtrl', ['$scope', '$rootScope', 'AuthService', 'StropheService', 'ChatCoreService',
			function ($scope, $rootScope, AuthService, StropheService, ChatCoreService) {
				

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
							// Do something on connecting state
							break;
						case Strophe.Status.CONNECTED:
							$scope.chatConnectionStatus = "Connected";
							$scope.connectedState();
							break;
						case Strophe.Status.DISCONNECTING:
							break;
						case Strophe.Status.DISCONNECTED:
							break;
						case Strophe.Status.AUTHENTICATING:
							break;
						case Strophe.Status.CONNECTED:
							break;
						case Strophe.Status.CONNFAIL:
							break;
						case Strophe.Status.AUTHFAIL:
							break;
					}
				});

				$scope.connectedState = function(){
					$rootScope.chatSDK.kill = "No";
					$rootScope.chatSDK.connection.addHandler($rootScope.chatSDK.ping_handler, null, "iq", null, "ping1"); 
				    $rootScope.chatSDK.connection.addHandler($rootScope.chatSDK.ping_handler_readACK, null, "iq", null, "readACK");   
				    var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
				    $rootScope.chatSDK.connection.sendIQ(iq, $rootScope.chatSDK.on_roster); 
				    
				    $rootScope.chatSDK.write_to_log("IQ for fetching contact information is send : " + iq);
				    $rootScope.chatSDK.connection.addHandler($rootScope.chatSDK.on_message, null, "message", "chat");
				     // var ping = $iq({to: to,type: "get",id: "ping1"}).c("ping", {xmlns: "urn:xmpp:ping"});
				     // console.log('ping message sent to : ' + to)
				     // $rootScope.chatSDK.connection.send(ping);
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