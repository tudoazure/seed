(function (angular){
	"use strict;"
	angular.module('bargain')
		.controller('AppCtrl', ['$scope', '$rootScope', 'AuthService',
			function ($scope, $rootScope, AuthService) {
				AuthService.auth("paytmagent4@mailinator.com", "paytmagent4");
			}
    	]);
})(angular);