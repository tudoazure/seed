(function (angular){
	"use strict;"
	angular.module('bargain')
		.controller('ChatCtrl', ['$scope', '$rootScope',
			function ($scope, $rootScope) {
    			$scope.contact = $rootScope.plustxtcacheobj.contact;
				$rootScope.$on('ChatObjectChanged', function(event, chatObj){
					$scope.$apply(function(){
				        $scope.contact = chatObj.contact;
				    });
				});
      }]);
})(angular);


