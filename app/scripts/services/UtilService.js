(function (angular){
	"use strict;"

	angular.module('bargain').factory('UtilService', ['$rootScope', function ($rootScope) {

		var getTimeInLongString = function(){
          return new Date().getTime();
        };

        parseTime = function(dateString){
			var parseDate = new Date();
			if(dateString){
				var date = new Date (dateString);
				var momentDate = moment(dateString);
				parseDate = momentDate.format("h:mm a");
			}
			return parseDate;
		};

		parseDate = function(dateString){
			var parseDate = new Date();
			if(dateString){
				var date = new Date (dateString);
				var momentDate = moment(dateString);
				parseDate = momentDate.format("DD MMM YYYY");

			}
			return parseDate;
		};

        var milliTimeToString = function(inMilliSeconds) {
		    var date = new Date(inMilliSeconds);
		    var strTime = parseDate(date) + " "+ parseTime(date);
		    return strTime;
		};

        var jIdToId = function(jid) {
	        return Strophe.getBareJidFromJid(jid).replace("@", "-").replace(/\./g, "-");
    	};

    	var getAllPendingMessages = function(){
	        // var plustxtid = "Plustx_" + LocalCache.plustxtid;
	        // var plustxtobject = $.jStorage.get(plustxtid);
	        var messagearray = [];
	        var offlinemessage;
	        var midread = new Array();
	        var MessageList = $rootScope.plustxtcacheobj['message'];
	        for (var key in MessageList)
	        {
	            messagearray = $rootScope.plustxtcacheobj['message'][key];
	            for (var key1 in messagearray)
	            {
	                if (messagearray[key1]['state'] == -1) {      
	                    offlinemessage = {};
	                    offlinemessage['tegoid'] = messagearray[key1]['receiver'];
	                    offlinemessage['body'] = messagearray[key1]['txt']
	                    offlinemessage['mid'] = messagearray[key1]['mid'];
	                    midread[midread.length] = offlinemessage;
	                }
	            }
	        }
	        return midread;
	    };

    	var addMessage = function(inRecieverJID, inSenderJID, inMessage, inTime, mid) {
        	var otherpartyid;
	        var messagelist = [];
	        var receiverTigoId = inRecieverJID.substring(0, inRecieverJID.lastIndexOf('@'));
	        var senderTigoId = inSenderJID.substring(0, inSenderJID.lastIndexOf('@'));
	        var messageobj = {};
	        messageobj['deleted_on_sender'] = "false";
	        messageobj['sender'] = senderTigoId;
	        messageobj['receiver'] = receiverTigoId;
	        messageobj['can_forward'] = "true";
	        messageobj['delete_after'] = "-1";
	        messageobj['last_ts'] = inTime;
	        messageobj['sent_on'] = inTime;
	        messageobj['txt'] = inMessage;
	        messageobj['id'] = "";
	        messageobj['mid'] = mid;
	        messageobj['flags'] = 0;//0-sent;1-recieved
	        messageobj['state'] = 0;//0-sending;1-sent;2-Delivered;3-read

	        if (receiverTigoId == $rootScope.tigoId){
	            otherpartyid = senderTigoId;
	        }
	        else{
	            otherpartyid = receiverTigoId;
	        }

	        if ($rootScope.plustxtcacheobj['contact'].hasOwnProperty(otherpartyid))
	        {
	        	$rootScope.plustxtcacheobj.contact[otherpartyid].lastActive = getTimeInLongString();
	        }
	        else {
	            $rootScope.usersCount = $rootScope.usersCount + 1;
	        	var contactObj = {};
	        	contactObj.name = "Guest " + $rootScope.usersCount;
	        	contactObj.id   = otherpartyid;
	        	contactObj.lastActive = getTimeInLongString();
	        	$rootScope.plustxtcacheobj['contact'][otherpartyid] = contactObj;
	        } 

	        if ($rootScope.plustxtcacheobj['message'].hasOwnProperty(otherpartyid))
	        {
	            messagelist = $rootScope.plustxtcacheobj['message'][otherpartyid];
	            messagelist.push(messageobj)
	        }
	        else {
	            messagelist = [];
	            messagelist.push(messageobj);
	        }          
	        $rootScope.plustxtcacheobj['message'][otherpartyid] = messagelist;
	        $rootScope.$broadcast("ChatObjectChanged", $rootScope.plustxtcacheobj);
	    };

		UtilService = {
      		getTimeInLongString: getTimeInLongString,
      		getMilliTimeToString : milliTimeToString,
      		getJidToId : jIdToId,
      		addMessage : addMessage,
      		getAllPendingMessages : getAllPendingMessages 

      	}

		return UtilService;
	}]);
})(angular);