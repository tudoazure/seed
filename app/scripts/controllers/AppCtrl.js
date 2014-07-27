(function (angular){
	"use strict;"
	angular.module('bargain')
		.controller('AppCtrl', ['$scope', '$rootScope', 'AuthService',
			function ($scope, $rootScope, AuthService) {
				AuthService.chatServerLogin.query({
					email : "paytmagent1@mailinator.com",
					access_token : "a530b677-b7e5-4d0e-9518-f4b1b0463e50",
					device_type : "web",
					device_id : "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36",
					utype : "Normal",
					device_token : "TOKEN",
					device_detail : "none+details"
				}, function success(data){
					console.log("Success", data);
				}, function failure(error){
					console.log("Error", error);
				})
			}
    	]);
})(angular);