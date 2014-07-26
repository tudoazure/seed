"use strict;"
var chatPanel = angular.module('chatPanel', ['ngRoute']);
chatPanel.config(function($routeProvider , $locationProvider){
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