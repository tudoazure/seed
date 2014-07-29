(function (angular){
	"use strict;"

	angular.module('bargain').factory('StropheService', ['$rootScope', 'ChatCoreService', function ($rootScope, ChatCoreService) {

		var StropheService;
		var connection = function(login, password) {
			var connect = new Strophe.Connection(Globals.AppConfig.StropheConnect);
			connect.connect(login, password, function (status) {
				console.log("StropheService Status : " + status);
				$rootScope.$emit("StropheStatusChange", status, connect);
			})
		};
		StropheService = {
      		connection: connection,
      	}
		return StropheService;
	}]);
})(angular);