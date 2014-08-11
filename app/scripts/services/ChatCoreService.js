(function (angular){
	"use strict;"

	angular.module('bargain').factory('ChatCoreService', [ '$rootScope', 'UtilService',
     function ( $rootScope, UtilService ) {

		var ChatCoreService;
		
    var on_Message_Update_Chat = function(response){
      var full_jid = response['full_jid'];
      var composing = response['composing'];
      var body = response['body'];
      var messageId = response['id'];
      var isProductDetails = false;
      if(response['id']){
        isSpecialMessage = response['isSpecialMessage'];
      }
      var jid = Strophe.getBareJidFromJid(full_jid);
      var jid_id = UtilService.getJidToId(jid);

      var MessID='mid-'+messageId;
       if (body) {
        var timeInMilliSeconds = messageId.substr(messageId.lastIndexOf('-') + 1, messageId.length);
        var strTimeMii = timeInMilliSeconds.toString().substring(0, 10);
        UtilService.addMessage($rootScope.plustxtId, jid, body, strTimeMii, messageId, isSpecialMessage);
      }  
    };
	
    var chatSDK = {
        //it keeps Connection string
        connection: null,
        pingRef : null,
        PingCount: 0,
        reLoad: null,
        readACKO : [],
        kill:"No",
        jid_to_id: function(jid) {
            return Strophe.getBareJidFromJid(jid)
                    .replace("@", "-")
                    .replace(/\./g, "-");
        },

        write_to_log: function(message) {
             console.log(message);
        },

        on_roster: function(iq) {
            $rootScope.chatSDK.write_to_log('ChatCoreService: on_roster called');
            var JsonResponse = {};
            $(iq).find('item').each(function() {
                var Item = {};
                var jid = $(this).attr('jid');
                Item['plustxtId'] = $(this).attr('jid');
                if($(this).attr('name') === undefined){
                  self.guestUserId = self.guestUserId + 1;
                  Item['name'] = "Guest User " + self.guestUserId;
                }
                else{
                   Item['name'] = $(this).attr('name')
                }
                Item['tegoid'] = Strophe.getNodeFromJid(Item['plustxtId']);
                JsonResponse[jid] = Item;
            });
            $rootScope.chatSDK.connection.addHandler($rootScope.chatSDK.on_presence, null, "presence");
            // Send the presence information
            $rootScope.chatSDK.connection.send($pres());
        },

        /*
         function                : presence_value()
         parameters     input    : html li component
         parameters     output   : 
         parameter description   : 
         
         function  description   : sort li components
         
         */
        presence_value: function(elem) {
          if (elem.hasClass('online')) {
            return 2;
          } 
          else if (elem.hasClass('away')) {
              return 1;
          }
          return 0;
        },
        /*
         function                : on_presence()
         parameters     input    : presence stanze
         parameters     output   : 
         parameter description   : 
         
         function  description   : This function is the deault handler for presence stanze
         When a new presence stanze becomes availble, this function will be called .
         This Function will create JSON Object with attributes available in presence and
         call UI function on_Presence_Update_Contact for update UI .
         
         */
        on_presence: function(presence) {

            var ptype = $(presence).attr('type');
            var from = $(presence).attr('from');
            var show = $(presence).find("show").text();
            var JsonResponse = {};
            JsonResponse['jid'] = from;
            JsonResponse['type'] = ptype;
            JsonResponse['show'] = show;
            console.log("ChatCoreService @on_presence", JsonResponse);
            return true;

        },
        /*
         function                : on_message()
         parameters     input    : message stanze
         parameters     output   : 
         parameter description   : 
         */
        on_message: function(message) {
            console.log("ChatCoreService @on_message called :");
            var body = $(message).find("html > body");
            if (body.length === 0) {
                body = $(message).find('body');
                if (body.length > 0) {
                    body = body.text().trim();
                } else {
                    body = null;
                }
            } else {
                body = body.contents();
                var span = $("<span></span>");
                body.each(function() {
                    if (document.importNode) {
                        $(document.importNode(this, true)).appendTo(span);
                    } else {
                        span.append(this.xml);
                    }
                });
                body = span;
            }
            console.log("ChatCoreService  @on_message - Message Text :", body);
            var response = {};
            response['full_jid'] = $(message).attr('from');
            response['id'] = $(message).attr('id');
            var jid = $(message).attr('from');
            var messageID = $(message).attr('id');
            response['composing'] = $(message).find('composing');
            response['body'] = body.trim();
            try{
              var productDetail = JSON.parse(body);
              response['isSpecialMessage'] = true;
            }
            catch(e){
              response['isSpecialMessage'] = false;
            }

            var DeliveryMessgae = messageID.search("-dv-");
            var readMessageAcknow = messageID.search("-r-");
            // Message stanze is an acknowledment 

            if (DeliveryMessgae != -1) {
                // code for update/ inform the user regarding delivered or read information
                var delivered = $(message).find("delivered");
                try {
                    var deliveryAckID = $(delivered).text();
                } catch (err) {
                }

                var read = $(message).find("read");
                try {
                    var readAckID = $(read).text();
                } catch (err) {
                }
                // Delivery Acknowledgment
                if (deliveryAckID){
                  console.log("@on_message : Status -- DELIVERED From : " + response['full_jid']);
                  // LocalCache.updateMessageStatus(deliveryAckID, 2, Strophe.getNodeFromJid(jid), timeInMilliSecond);
                  // $('#mid-'+deliveryAckID).html('Delivered');
                  //$rootScope.chatSDK.write_to_log("New STATUS Message ARRIVED! mid:" + message.id + " " + "Status: Delivered From: " + response['full_jid']);
                }
                //read  acknoledment
                if (readAckID){
                  console.log("@on_message : Status -- READ From : " + response['full_jid']);
                  // LocalCache.updateMessageStatus(readAckID, 3, Strophe.getNodeFromJid(jid), timeInMilliSecond);
                  // $('#mid-'+readAckID).html('Read&nbsp;');
                  //$rootScope.chatSDK.write_to_log("New STATUS Message ARRIVED! mid:" + message.id + " " + "Status: Read From: " + response['full_jid']);
                }
            }
            else if(readMessageAcknow != -1){
                var read = $(message).find("read");
                try {
                    var readAckID = $(read).text();
                } catch (err) {
                }
                if (readAckID){
                  console.log("@on_message : Status -- READ From : " + response['full_jid']);
                  // LocalCache.updateMessageStatus(readAckID, 3, Strophe.getNodeFromJid(jid), timeInMilliSecond);
                  // $('#mid-'+readAckID).html('Read&nbsp;');
                  //utility.comn.consoleLogger("New READ STATUS Message ARRIVED! Message Read: " + readAckID +  " From: " + response['full_jid']);
                }
            }
             else {
                console.log("@on_message :New Text Message : " + message.textContent);
                var strTimeMii = UtilService.getTimeInLongString().toString();
                var messageId = $rootScope.tigoId + "-dv-" + strTimeMii;
                var mid = messageId.toString();
                // Sending delivery acknowledment back.
                var message2 = $msg({to: response['full_jid'], "type": "chat", "id": mid}).c('delivered').t(messageID).up().c('meta');
                // $('#mid-'+messageID).html('Delivered&nbsp;');
                on_Message_Update_Chat(response);
                $rootScope.chatSDK.connection.send(message2);
                console.log('@on_message : Delivery Acknowledment Sent ' + message2);
            }
            return true;
        },

       ping_handler : function (iq){
          console.log('ping_handler Called');
         if($rootScope.chatSDK.kill=="Yes"){
                   return false;
         }
          $rootScope.chatSDK.PingCount=0;
          var offmessageArray= UtilService.getAllPendingMessages();       
           var jid;
           var mid;
           var body;
           var timeInMilliSecond;
           var strTimeMii;
           var message;

           if(offmessageArray == null || offmessageArray === undefined ){
                console.log("All Pending Messages Count:" + "0");
           }
           else{
              console.log("All Pending Messages Count : " + offmessageArray.length);
            for (var i=0 ; i < offmessageArray.length ; i++){
                 console.log('tegoid ' + offmessageArray[i]['tegoid']+ ' mid '+offmessageArray[i]['mid']+ 'body '+ offmessageArray[i]['body'])
                jid=offmessageArray[i]['tegoid']+'@' + "chat-staging.paytm.com";
                mid=offmessageArray[i]['mid'];
                body=offmessageArray[i]['body'];
                message = $msg({to: jid, "type": "chat", "id": mid}).c('body').t(body).up().c('active', {xmlns: "http://jabber.org/protocol/chatstates"}).up()
                .c('request', {xmlns: 'urn:xmpp:receipts'}).up().c('meta').c('acl', {deleteafter: "-1", canforward: "1", candownload: "1"});
                $rootScope.chatSDK.connection.send(message);
               timeInMilliSecond = UtilService.getTimeInLongString();
               strTimeMii = timeInMilliSecond.toString();
             //   utility.comn.consoleLogger(' local cache message status upadted from mid '+mid);
               UtilService.updateMessageStatus(mid, 0, Strophe.getNodeFromJid(jid), strTimeMii);
            }
           }
          return true;
       },
        send_ping : function(to){
          //   utility.comn.consoleLogger('to from send ping'+ to);
            var ping = $iq({to: to,type: "get",id: "ping1"}).c("ping", {xmlns: "urn:xmpp:ping"});
             utility.comn.consoleLogger('send_ping Called :' +  "to: " + to );
            
           $rootScope.chatSDK.pingRef= setInterval(function (){
                 $rootScope.chatSDK.connection.send(ping);                
             },1000);
            
       },
        ping_handler_readACK : function (iq){
               if($rootScope.chatSDK.kill=="Yes"){
                   return false;
               }
                if ($rootScope.chatSDK.readACKO.length > 0 ) {
                var infoObjec=$rootScope.chatSDK.readACKO.shift();
                var tigo_id=infoObjec['tigoid'];
                var timeStamp=infoObjec['timeStamp'];
                var jid=infoObjec['jid'];
                var jid_id=infoObjec['jid_id'];
                var timeInMilliSecond;
                var strTimeMii;
                var messageId;
                var mid;
                // Fetching all message whose status is delivered and send the ack for read status.
                // After fetching message , their status became modified to read .
                var midreadArray = LocalCache.updateMessageStatusAsRead(tigo_id, timeStamp);
                for (var i = 0; i < midreadArray.length; i++) {
                   //  utility.comn.consoleLogger('value of message id when clicking on left side panel'+midreadArray[i]);
                    timeInMilliSecond = getTimeInLongString();
                    strTimeMii = timeInMilliSecond.toString();
                    messageId = LocalCache.tigoid + "-r-" + strTimeMii;
                    mid = messageId.toString();
                    // Create read ack and send the corresoding jabber client/
                    // Note that since it is an delivery/ read ack , message ID containd -div- attributes
                    var message2 = $msg({to: jid, "type": "chat", "id": mid}).c('read').t(midreadArray[i]).up().c('meta');
                    $('#mid-'+midreadArray[i]).html('Read&nbsp;');
                    utility.comn.consoleLogger('Read Acknowledgement Sent: ' + message2);
                    $rootScope.chatSDK.connection.send(message2);
                }
                $rootScope.chatSDK.scroll_chat(jid_id);
                }
                
        return true;
        }           
  };


		ChatCoreService = {
      		chatSDK: chatSDK,
      	}

		return ChatCoreService;
	}]);
})(angular);

