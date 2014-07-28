(function (angular){
	"use strict;"
	angular.module('bargain')
		.controller('AppCtrl', ['$scope', '$rootScope', 'AuthService', 'StropheService', 'ChatCoreService',
			function ($scope, $rootScope, AuthService, StropheService, ChatCoreService) {
				

				$scope.init =function(){
					$rootScope.bargainAgent = user;
					$rootScope.chatSDK = ChatCoreService.chatSDK;
					$rootScope.plustxtid = null;
					$rootScope.sessionid = null;
					$rootScope.tigoid = null;
					$rootScope.plustxtcacheobj = null;
					$rootScope.loginusername = null;
					$rootScope.password = null;
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
						$rootScope.tigoid = response.data['tego_id'];
						$rootScope.sessionid = response.data['session_id'];
						$rootScope.plustxtid = response.data['tego_id'] + "@" + Globals.AppConfig.ChatHostURI;
						$rootScope.password = response.data['password'] + response.data['tego_id'].substring(0, 3);
						$scope.stropheConnection($rootScope.plustxtid, $rootScope.password);

					}, function failure(error){
						console.log("Error", error);
					})
				};

				$scope.stropheConnection = function(loginId, pwd){
					var connect = new Strophe.Connection(Globals.AppConfig.StropheConnect);
					connect.connect(loginId, pwd, function (status) {
						$rootScope.chatStatus = status;
						if (status === Strophe.Status.CONNECTED) {
							$rootScope.chatSDK.connection = connect;
							$scope.connectedState();
							// $rootScope.chatSDK.connection = connect;
							// $rootScope.chatSDK.connection.addHandler($rootScope.chatSDK.ping_handler, null, "iq", null, "ping1"); 
						} else if (status === Strophe.Status.DISCONNECTED) {
							$rootScope.chatSDK.connection = connect;
						} else if (status === Strophe.Status.CONNECTING) {
							$rootScope.chatSDK.connection = connect;
						} else if (status === Strophe.Status.AUTHENTICATING) {
							$rootScope.chatSDK.connection = connect;
						} else if (status === Strophe.Status.DISCONNECTING) {
							$rootScope.chatSDK.connection = connect;
						} else if (status === Strophe.Status.CONNFAIL) {
							$rootScope.chatSDK.connection = connect;
						} else if (status === Strophe.Status.AUTHFAIL) {
							$rootScope.chatSDK.connection = connect;
						}
						console.log(status);
					})
				};

				$scope.$watch('chatStatus', function(newValue, oldValue){
					console.log('status')
				});

				$scope.connectedState = function(){
					$rootScope.chatSDK.kill = "No";
					$rootScope.chatSDK.connection.addHandler($rootScope.chatSDK.ping_handler, null, "iq", null, "ping1"); 
				    $rootScope.chatSDK.connection.addHandler($rootScope.chatSDK.ping_handler_readACK, null, "iq", null, "readACK");   
				    var domain = Strophe.getDomainFromJid($rootScope.chatSDK.connection.jid);//
				    clearInterval($rootScope.chatSDK.sendPingRef);
				    $rootScope.chatSDK.connectionStatus="OK"

				    var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
				    $rootScope.chatSDK.connection.sendIQ(iq, $rootScope.chatSDK.on_roster); 
				    
				    $rootScope.chatSDK.write_to_log("IQ for fetching contact information is send : " + iq);
				    // Register listeners from roster change and new message
				    // $rootScope.chatSDK.connection.addHandler($rootScope.chatSDK.on_roster_changed, "jabber:iq:roster", "iq", "set");
				    $rootScope.chatSDK.connection.addHandler($rootScope.chatSDK.on_message, null, "message", "chat");
				     var ping = $iq({to: to,type: "get",id: "ping1"}).c("ping", {xmlns: "urn:xmpp:ping"});
				     console.log('ping message sent to : ' + to)
				     $rootScope.chatSDK.connection.send(ping);
				};

				$scope.init();
				$scope.loginToChatServer();

			}
    	]);
})(angular);