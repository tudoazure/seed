(function (angular){
"use strict;"
	var app = angular.module('bargain', ['ngRoute', 'ngResource', 'LocalStorageModule']);
	
	app.config(['$routeProvider', function($routeProvider){
		$routeProvider
			.when('/',{
				templateUrl:'app/views/partials/chatview.html',
				controller : ''
			})
			.when('/chat',{
				templateUrl:'app/views/partials/chatview.html',
				controller : ''
			})
			.otherwise({
				redirectTo: '/'
			});
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