(function (angular){
	"use strict;"
	angular.module('bargain')
		.controller('ChatCtrl', ['$scope', '$rootScope', 'ChatCoreService',
			function ($scope, $rootScope, ChatCoreService) {
				$scope.activeWindows = $rootScope.plustxtcacheobj.messages;
    			$scope.contact = $rootScope.plustxtcacheobj.contact;
				$rootScope.$on('ChatObjectChanged', function(event, chatObj){
					$scope.$apply(function(){
				        $scope.contact = chatObj.contact;
				        $scope.activeWindows = chatObj.message;
				    });
				});

				$scope.sendMessage = function(message){
					
				};
      }]);
})(angular);


