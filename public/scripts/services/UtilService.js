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

		var getLocalTime = function(ts) {
			return moment.unix(ts).format("h:mm:ss a");
            //return moment.unix(ts).format("MMM Do, h:mm:ss a");
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
	        var messageArray = [];
	        var offlinemessage;
	        var midread = new Array();
	        var MessageList = $rootScope.plustxtcacheobj['message'];
	        for (var key in MessageList)
	        {
	            messageArray = $rootScope.plustxtcacheobj['message'][key];
	            for (var key1 in messageArray)
	            {
	                if (messageArray[key1]['state'] == -1) {      
	                    offlinemessage = {};
	                    offlinemessage['tegoid'] = messageArray[key1]['receiver'];
	                    offlinemessage['body'] = messageArray[key1]['txt']
	                    offlinemessage['mid'] = messageArray[key1]['mid'];
	                    midread[midread.length] = offlinemessage;
	                }
	            }
	        }
	        return midread;
	    };

	    var updateMessageStatus = function(inmessageid, instatus, inotherpartytigoid, intime){
	        var messageArray =  $rootScope.plustxtcacheobj['message'][inotherpartytigoid];
	        for (var key in messageArray)
	        {
	            if (messageArray[key]['mid'] == inmessageid) {
	                messageArray[key]['state'] = instatus;
	                messageArray[key]['last_ts'] = intime;
	            }
	        }
	        $rootScope.plustxtcacheobj['message'][inotherpartytigoid] = messageArray;
	    };

	    var updateMessageStatusAsRead = function(inotherpartytigoid, intime){
			var messageArray = $rootScope.plustxtcacheobj['message'][inotherpartytigoid];
			var midread = [];
			for (var key in messageArray)
			{
			    if (messageArray[key]['state'] == 0 && messageArray[key]['sender'] == inotherpartytigoid) {
			        messageArray[key]['state'] = 3;
			        messageArray[key]['last_ts'] = intime;
			        midread[midread.length] = messageArray[key]['mid'];
			    }
			}
			$rootScope.plustxtcacheobj['message'][inotherpartytigoid] = messageArray;
			return midread;
		};

    	var addMessage = function(inRecieverJID, inSenderJID, inMessage, inTime, mid, isSpecialMessage) {
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
	        messageobj['isProductDetails'] = false;
	        messageobj['isCloseChatMesg'] = false;

	        

	        if (receiverTigoId == $rootScope.tigoId){
	            otherpartyid = senderTigoId;
	        }
	        else{
	            otherpartyid = receiverTigoId;
	        }
	        if(isSpecialMessage){
	        	try{
	        		var specialMessage = JSON.parse(inMessage);
	        		if(specialMessage.PRDCNTXT){
		        		messageobj['isProductDetails'] = true;
						var productObj ={}
						productObj.imageUrl = specialMessage.PRDCNTXT.image_url;
						productObj.description = specialMessage.PRDCNTXT.description;
						productObj.price = specialMessage.PRDCNTXT.price.replace("Rs" , "").trim();
						productObj.merchantId = specialMessage.PRDCNTXT.merchant_id;
						productObj.productId = specialMessage.PRDCNTXT.id;
						productObj.userId = specialMessage.PRDCNTXT.user_id;
						productObj.productUrl = specialMessage.PRDCNTXT.product_url;
						$rootScope.plustxtcacheobj.products[otherpartyid] = productObj;
			        }
			        else if(specialMessage.CLSCHAT){
			        	messageobj['isCloseChatMesg'] = true;
			        }
	            }
	            catch(e){
	            }
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
      		getAllPendingMessages : getAllPendingMessages,
      		updateMessageStatus : updateMessageStatus,
      		updateMessageStatusAsRead : updateMessageStatusAsRead,
      		getLocalTime : getLocalTime

      	}

		return UtilService;
	}]);
})(angular);