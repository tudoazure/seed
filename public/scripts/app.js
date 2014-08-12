(function (angular){
"use strict;"
	var app = angular.module('bargain', ['ngRoute', 'ngResource', 'LocalStorageModule', 'ui.bootstrap']);
	
	app.config(['$routeProvider', function($routeProvider){
		$routeProvider
			.when('/',{
				templateUrl:'partials/overallView.html',
				controller : ''
			})
			.when('/chat',{
				templateUrl:'partials/chatview.html',
				controller : ''
			})
			.otherwise({
				redirectTo: '/'
			});
	}])
	.run(['datepickerPopupConfig', function(datepickerPopupConfig) {
	    datepickerPopupConfig.appendToBody = true;
	    datepickerPopupConfig.showButtonBar = false;

	}]);


	app.config(['$httpProvider', function($httpProvider){
	  $httpProvider.defaults.useXDomain = true;
	}]);

	app.config(['$resourceProvider', function($resourceProvider){
	  $resourceProvider.defaults.stripTrailingSlashes = false;
	}]);

	app.config(['localStorageServiceProvider', function(localStorageServiceProvider){
	  localStorageServiceProvider.setPrefix('bargain');
	}]);
})(angular);