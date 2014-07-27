(function (angular){
	"use strict;"

	angular.module('bargain').factory('AuthService', ['$resource', function ($resource) {

		var AuthService;
		var manageReqPacketTransform = function(Obj) {
		    var str = [];
		    for(var p in Obj){
		      if(typeof(Obj[p]) == "object"){
		          str.push(encodeURIComponent(p) + "=" + JSON.stringify(Obj[p]));
		      } else {
		          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(Obj[p]));
		      }
		    }
		    return str.join("&");
		};
		var chatServerLogin = $resource("https://chat-staging.paytm.com/accounts/connect/", {}, {
		  query: {
		    method:'POST', 
		    isArray: false, 
		    params:{}, 
		    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
		    transformRequest: manageReqPacketTransform
		  }
		});

		AuthService = {
      		chatServerLogin: chatServerLogin,
      	}

		return AuthService;
	}]);
})(angular);