(function (angular){
	"use strict;"
	angular.module('bargain')
		.controller('ChatCtrl', ['$scope', '$rootScope', 'ChatCoreService', 'UtilService',
			function ($scope, $rootScope, ChatCoreService, UtilService) {
				$scope.activeWindows = $rootScope.plustxtcacheobj.messages;
    			$scope.contact = $rootScope.plustxtcacheobj.contact;
    			$scope.products = $rootScope.plustxtcacheobj.products;
    			$scope.agentId = $rootScope.tigoId;
				$rootScope.$on('ChatObjectChanged', function(event, chatObj){
					$scope.$apply(function(){
				        $scope.contact = chatObj.contact;
				        $scope.activeWindows = chatObj.message;
				        $scope.products = chatObj.products;
				    });
				});

				$scope.sendMessage = function(body, jid){
					if(body !== ""){
			            var timeInMilliSecond = UtilService.getTimeInLongString();
			            var strTimeMii = timeInMilliSecond.toString();
			            var messageId = $rootScope.tigoId + "-c-" + strTimeMii;
			            var mid = messageId.toString();
			            var message = $msg({to: jid, "type": "chat", "id": mid}).c('body').t(body).up().c('active', {xmlns: "http://jabber.org/protocol/chatstates"}).up()
			            .c('meta').c('acl', {deleteafter: "-1", canforward: "1", candownload: "1"});
		             	var to = Strophe.getDomainFromJid($rootScope.chatSDK.connection.jid);
             			var ping = $iq({to: to,type: "get",id: "ping1"}).c("ping", {xmlns: "urn:xmpp:ping"});
             			$rootScope.chatSDK.connection.send(ping);

			        }
				};
      }]);
})(angular);


