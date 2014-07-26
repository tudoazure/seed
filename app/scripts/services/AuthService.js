(function (angular){
	"use strict;"

	angular.module('bargain').factory('AuthService', ['$rootScope', function ($rootScope) {
		return {
			auth: function(login, password) {
				var connect = new Strophe.Connection('http://mydomain.net/http-bind');
				connect.connect(login, password, function (status) {
				   if (status === Strophe.Status.CONNECTED) {
				   }
				})
			}
		}
	}]);
})(angular);
