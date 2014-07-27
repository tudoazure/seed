(function (angular){
"use strict;"
	var app = angular.module('bargain', ['ngRoute', 'ngResource', 'LocalStorageModule']);
	app.config(['$routeProvider', '$httpProvider', '$resourceProvider', function($routeProvider , $httpProvider, $resourceProvider){
		$httpProvider.defaults.useXDomain = true;
		$resourceProvider.defaults.stripTrailingSlashes = false;
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
	app.config(['localStorageServiceProvider', function(localStorageServiceProvider){
	  localStorageServiceProvider.setPrefix('bargain');
	}])
})(angular);