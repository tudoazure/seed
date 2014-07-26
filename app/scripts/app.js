(function (angular){
"use strict;"
	var app = angular.module('bargain', ['ngRoute']);
	app.config(function($routeProvider , $locationProvider){
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
	});
})(angular);