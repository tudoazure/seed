(function (angular){
	"use strict;"
	angular.module('bargain')
		.controller('AppCtrl', ['$scope', '$rootScope', 'AuthService',
			function ($scope, $rootScope, AuthService) {
				$rootScope.bargainAgent = user;
				AuthService.chatServerLogin.query({
					email : $rootScope.bargainAgent.email,
					access_token : $rootScope.bargainAgent.token,
					device_type : "web",
					device_id : navigator.userAgent,
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