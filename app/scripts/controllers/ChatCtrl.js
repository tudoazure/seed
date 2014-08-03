(function (angular){
	"use strict;"
	angular.module('bargain')
		.controller('ChatCtrl', ['$scope', '$rootScope',
			function ($scope, $rootScope) {
    			$scope.contact = $rootScope.plustxtcacheobj.contact;
				$rootScope.$on('ContactChange', function(event, contact){
					$scope.contact = contact;
				});
      }]);
})(angular);


