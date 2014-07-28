(function (angular){
	"use strict;"
	angular.module('bargain')
		.controller('AppCtrl', ['$scope', '$rootScope', 'AuthService', 'StropheService', 'ChatCoreService',
			function ($scope, $rootScope, AuthService, StropheService, ChatCoreService) {
				init();
				loginToChatServer();

				function init(){
					$rootScope.bargainAgent = user;
					$rootScope.chatSDK = ChatCoreService.chatSDK;
					$rootScope.plustxtid = null;
					$rootScope.sessionid = null;
					$rootScope.tigoid = null;
					$rootScope.plustxtcacheobj = null;
					$rootScope.loginusername = null;
					$rootScope.password = null;
				}

				function loginToChatServer(){
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
						StropheService.connection($rootScope.plustxtid, $rootScope.password);

					}, function failure(error){
						console.log("Error", error);
					})
				}
			}
    	]);
})(angular);