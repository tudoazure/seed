(function (angular){
	"use strict;"

	angular.module('bargain').factory('UtilService', ['$resource', function ($resource) {

		var getTimeInLongString = function(){
          return new Date().getTime();
        },

		UtilService = {
      		getTimeInLongString: getTimeInLongString,
      	}

		return UtilService;
	}]);
})(angular);