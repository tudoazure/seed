(function (angular){
	"use strict;"

	angular.module('bargain').factory('StropheService', ['$rootScope', 'ChatCoreService', function ($rootScope, ChatCoreService) {

		var StropheService;
		var connection = function(login, password) {
			var connect = new Strophe.Connection(Globals.AppConfig.StropheConnect);
			connect.connect(login, password, function (status) {
				if (status === Strophe.Status.CONNECTED) {
					$rootScope.chatSDK.connection = connect;
					$rootScope.chatSDK.connection.addHandler($rootScope.chatSDK.ping_handler, null, "iq", null, "ping1"); 
				} else if (status === Strophe.Status.DISCONNECTED) {

				} else if (status === Strophe.Status.CONNECTING) {

				} else if (status === Strophe.Status.AUTHENTICATING) {

				} else if (status === Strophe.Status.DISCONNECTING) {

				} else if (status === Strophe.Status.CONNFAIL) {

				} else if (status === Strophe.Status.AUTHFAIL) {

				}
				console.log(status);
			})
		};

		StropheService = {
      		connection: connection,
      	}

		return StropheService;
	}]);
})(angular);