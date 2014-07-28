(function (angular){
	"use strict;"

	angular.module('bargain').factory('ChatCoreService', [ '$rootScope', '$resource',
     function ( $rootScope, $resource ) {

		var ChatCoreService;
		
	
    var chatSDK = {
        //it keeps Connection string
        connection: null,
        //it keeps Currenlty Displayed Div name 
        displayedChatDiv: null,
        reconnectInProgress : "No",
        reconnectEnabled: "No",
        networkConnection :"DOWN",
        sendPingRef : null,
        connectionStatus: "NA",
        upTime : 0,
        pingRef : null,
        downTime : 0,
        PingCount: 0,
        uIExist :"No",
        reLoad: null,
        readACKO : [],
        kill:"No",
        // It keeps already Opened ChatDiv 
        openedChatDiv: {},
        // Connection url
        connectionurl: null,
        // List of pending subscription
        contact_subsription: {},
        // it keeps track of Name and jid_id mapping
        nameList: {},
        // Mode of Operation 
        XMPPorAPIXMPP: 0,
        // it keeps pending subscriber jid
        pending_subscriber: null,
        //it keeps lastly performed ajax request
        jqueryStore: null,
        /*
         function                : jid_to_id()
         parameters     input    : jid
         parameters     output   : jid_id
         parameter description   : jid_id  is the replacement of jid with all dots and @ replaced by underscore
         
         function  description   : convert jid to jid_id.
         */
        jid_to_id: function(jid) {
            return Strophe.getBareJidFromJid(jid)
                    .replace("@", "-")
                    .replace(/\./g, "-");
        },
        /*
         function                : write_to_log()
         parameters     input    : string
         parameters     output   : 
         parameter description   : message
         
         function  description   : Used to write the string to conole
         */
        write_to_log: function(message) {
             console.log(message);
        },
        /*
         function                : on_roster()
         parameters     input    : iq stanze
         parameters     output   : 
         parameter description   : 
         
         function  description   : Act as listener for roster. 
         Function get called when new roster information available from server 
         */
        on_roster: function(iq) {
            $rootScope.chatSDK.write_to_log('on_roster called');
            var JsonResponse = {};
            // Function iterate each roster contact and prepare it as JSON object and
            // Call the update roster function with created JSON Object
            
            
            $(iq).find('item').each(function() {
                var Item = {};
                var jid = $(this).attr('jid');
                Item['plustxtid'] = $(this).attr('jid');
                if($(this).attr('name') === undefined){
                  self.guestUserId = self.guestUserId + 1;
                  Item['name'] = "Guest User " + self.guestUserId;
                }
                else{
                   Item['name'] = $(this).attr('name')
                }
                 // utility.comn.consoleLogger('name: ' + Item['name'] + ' jid: ' + jid);
                Item['tegoid'] = Strophe.getNodeFromJid(Item['plustxtid']);
                JsonResponse[jid] = Item;
            });
            //on_roster_Get_Contact(JsonResponse);
            //Check cache has plustxt reference object
            //If cache object exists use that object else get details from
            //API and create local cache object for the reference
            var plustxtref = "Plustx_" + LocalCache.plustxtid;
            var value = $.jStorage.get(plustxtref, null);
            // Set the localcache since cache is empty
            if (value == null)
                self.setDataToLocalCache(JsonResponse);
            //  utility.comn.consoleLogger('start fetching from storage');
            // get roster from cache 
            var JsonResponse = self.getAllRosters();
            //  utility.comn.consoleLogger('start fetching from storage completed');
            //  utility.comn.consoleLogger('start inserting contact to li');
            // Hide the home page 
            if(self.chatSDK.uIExist === "No") {
            self.chatSDK.uIExist = "Yes";
            hideHomePageDiv();
            // Populate the roster-contact with new contact
            self.on_roster_Get_Contact(JsonResponse);
            // Create Left Side history panel for conact who habe chat history
            self.on_roster_Create_ChatDiv(JsonResponse);
            }
            
            if( self.chatSDK.reLoad != null){
                if(self.chatSDK.reLoad['displayedWindow']!= null){
                   //   utility.comn.consoleLogger(self.chatSDK.reLoad['jid_id']+'^^^'+ self.chatSDK.reLoad['jid']+'^^^^'+ self.chatSDK.reLoad['name']+'^^^^^'+self.chatSDK.reLoad['jid'].substring(0,self.chatSDK.reLoad['jid'].indexOf('@'))); 
                    self.addChatAreaAndChatList(self.chatSDK.reLoad['jid_id'],self.chatSDK.reLoad['name'],self.chatSDK.reLoad['jid']);
                  //   utility.comn.consoleLogger(self.chatSDK.reLoad['jid_id']+'^^^'+ self.chatSDK.reLoad['jid']+'^^^^'+ self.chatSDK.reLoad['name']+'^^^^^'+self.chatSDK.reLoad['jid'].substring(0,self.chatSDK.reLoad['jid'].indexOf('@')));
                     self.insert_Message(self.chatSDK.reLoad['jid_id'], self.chatSDK.reLoad['jid'], self.chatSDK.reLoad['name'],self.chatSDK.reLoad['jid'].substring(0,self.chatSDK.reLoad['jid'].indexOf('@')));
                 }
            }
            $.jStorage.deleteKey('reLoadObject');
            
          //   utility.comn.consoleLogger('start inserting contact to li completed');
            // set up presence handler and send initial presence
            self.chatSDK.connection.addHandler(self.chatSDK.on_presence, null, "presence");
            // Send the presence information
            self.chatSDK.connection.send($pres());
            try
            {
                //Used to display progress bar until roster gets loaderd
                disableProgress();
                //Used to show/hide top menu tab links based on the tegi_id and sessionid
                enableOrDisableTabLink();
            }
            catch (e) {
            }
        },
        /*
         function                : insert_contact()
         parameters     input    : html li component
         parameters     output   : 
         parameter description   : 
         
         function  description   : Used to insert li element to ul
         
         */
        insert_contact: function(elem) {
          var jid = elem.find('.roster-jid').text();
          var pres = self.chatSDK.presence_value(elem.find('.roster-contact'));
          self.chatSDK.write_to_log('insert contact called ' + jid + '  ' + pres);
          var contacts = $('#roster-area li');
          // utility.comn.consoleLogger('contact length ' + contacts.length);
          // If Ul contain contacts
          if (contacts.length > 0) {
              var inserted = false;
              // Sort the insert the new contact 
              contacts.each(function() {
                  var cmp_pres = self.chatSDK.presence_value(
                          $(this).find('.roster-contact'));
                  var cmp_jid = $(this).find('.roster-jid').text();
               //    utility.comn.consoleLogger('pres  ' + pres + 'cmp_pres ' + cmp_pres);
                //   utility.comn.consoleLogger('  jid  ' + jid + 'cmp_jid ' + cmp_jid);
                  if (pres > cmp_pres) {
                    //   utility.comn.consoleLogger(' Reapeat pres  ' + pres + 'cmp_pres ' + cmp_pres);
                      $(this).before(elem);
                      inserted = true;
                      return false;
                  }
              });
              if (!inserted) {
                  self.chatSDK.write_to_log('inside insert contact  !inserted called');
                  $('#roster-area ul').append(elem);
              }
          }
          // No new contatc , insert the contact directly.
          else {
              self.chatSDK.write_to_log('inside insert contact  inserted called');
              $('#roster-area ul').append(elem);
          }
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
          //   utility.comn.consoleLogger(' new subsription message came ');
            var ptype = $(presence).attr('type');
            var from = $(presence).attr('from');
            var show = $(presence).find("show").text();
           //  utility.comn.consoleLogger(' new subsription message came type' + ptype + ' from ' + from + ' show' + show);
            var JsonResponse = {};
            JsonResponse['jid'] = from;
            JsonResponse['type'] = ptype;
            JsonResponse['show'] = show;


            // Pradeep Bhati : Commented for now to not make call to add To Contacts.
            //self.on_Presence_Update_Contact(JsonResponse);
            return true;

        },
        /*
         function                : scroll_chat()
         parameters     input    : jid_id
         parameters     output   : 
         parameter description   : jid_id of receipents                           
         function  description   : This function is used to scroll-Chat window                            
         
         */
        scroll_chat: function(jid_id) {
            // $('#DisplayDiv-' + jid_id).animate({scrollTop:$('#DisplayDiv-' + jid_id)[0].scrollHeight + 100}, 'slow')
            try{
              $('#DisplayDiv-' + jid_id).scrollTop($('#DisplayDiv-' + jid_id)[0].scrollHeight);
              return false;
            }
            catch(e){

            }
        },
        /*
         function                : on_message()
         parameters     input    : message stanze
         parameters     output   : 
         parameter description   : 
         
         function  description   : This function is the deault handler for message stanze
         When a new message stanze becomes availble, this function will be called .
         This Function will create JSON Object with attributes and childs available in message and
         call UI function on_Message_Update_Chat for update UI .
         If message stanze is an acknowleagement , correspsing message status will be updated. 
         If a normal text message , then send an delivery acknowldement back to jabber Client
         */
        on_message: function(message) {
            var body = $(message).find("html > body");
            if (body.length === 0) {
                body = $(message).find('body');
                if (body.length > 0) {
                    body = body.text();
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
                        // IE workaround
                        span.append(this.xml);
                    }
                });

                body = span;
            }
            var JsonResponse = {};

            JsonResponse['full_jid'] = $(message).attr('from');
            JsonResponse['id'] = $(message).attr('id');
            var jid = $(message).attr('from');
            var messageID = $(message).attr('id');
           //  utility.comn.consoleLogger(' message id ------>' + $(message).attr('id'));
            JsonResponse['composing'] = $(message).find('composing');
            JsonResponse['body'] = body;
            try{
              var productDetail = JSON.parse(body);
              JsonResponse['isProductDetails'] = true;
            }
            catch(e){
              JsonResponse['isProductDetails'] = false;
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
                //Delivery acknoledment
                if (deliveryAckID == undefined || deliveryAckID == "" || deliveryAckID == null) {

                }
                else
                {
                    LocalCache.updateMessageStatus(deliveryAckID, 2, Strophe.getNodeFromJid(jid), timeInMilliSecond);
                    $('#mid-'+deliveryAckID).html('Delivered');
                    self.chatSDK.write_to_log("New STATUS Message ARRIVED! mid:" + message.id + " " + "Status: Delivered From: " + JsonResponse['full_jid']);
                }
                //read  acknoledment
                if (readAckID == undefined || readAckID == "" || readAckID == null) {

                }
                else {
                    utility.comn.consoleLogger('message read message id ' + readAckID + ' from ' + JsonResponse['full_jid']);
                    LocalCache.updateMessageStatus(readAckID, 3, Strophe.getNodeFromJid(jid), timeInMilliSecond);
                    $('#mid-'+readAckID).html('Read&nbsp;');
                    self.chatSDK.write_to_log("New STATUS Message ARRIVED! mid:" + message.id + " " + "Status: Read From: " + JsonResponse['full_jid']);
                }
            }
            else if(readMessageAcknow != -1){
                var read = $(message).find("read");
                try {
                    var readAckID = $(read).text();
                } catch (err) {
                }
                if (readAckID == undefined || readAckID == "" || readAckID == null) {

                }
                else {
                    LocalCache.updateMessageStatus(readAckID, 3, Strophe.getNodeFromJid(jid), timeInMilliSecond);
                    $('#mid-'+readAckID).html('Read&nbsp;');
                    utility.comn.consoleLogger("New READ STATUS Message ARRIVED! Message Read: " + readAckID +  " From: " + JsonResponse['full_jid']);
                }
            }
             else {
                self.chatSDK.write_to_log('New Message ARRIVED! mid:' + messageID + " " + "Text: " + message.textContent);
                var timeInMilliSecond = self.getTimeInLongString();
                var strTimeMii = timeInMilliSecond.toString();
                var messageId = LocalCache.tigoid + "-dv-" + strTimeMii;
                var mid = messageId.toString();
                // Sending delivery acknowledment back.
                var message2 = $msg({to: JsonResponse['full_jid'], "type": "chat", "id": mid}).c('delivered').t(messageID).up().c('meta');
                $('#mid-'+messageID).html('Delivered&nbsp;');
                self.on_Message_Update_Chat(JsonResponse);
                self.chatSDK.connection.send(message2);
                utility.comn.consoleLogger('Delivery Acknowledment Sent ' + message2);
            }
            return true;
        },


        /*
         function                : on_roster_changed()
         parameters     input    : iq stanze
         parameters     output   : 
         parameter description   : 
         
         function  description   : This function is the deault handler for iq stanze
         When a new iq stanze becomes availble, this function will be called .
         This Function will create JSON Object with attributes and childs available in iq and
         call UI function on_Roster_Changed_Update_Contact for update UI .
         
         */
        on_roster_changed: function(iq) {
            self.chatSDK.write_to_log('on_roster_changed called');
            var JsonResponse = {};
            $(iq).find('item').each(function() {
                var Items = {};
                var jid = $(this).attr('jid');
                Items['sub'] = $(this).attr('subscription');
                Items['jid'] = $(this).attr('jid');
                Items['name'] = $(this).attr('name') || jid;
                JsonResponse[jid] = Items;
            });
            self.on_Roster_Changed_Update_Contact(JsonResponse);
            return true;
        },

       ping_handler : function (iq){
          utility.comn.consoleLogger('ping_handler Called');
         if(self.chatSDK.kill=="Yes"){
                   return false;
         }
           // function  will be called to sent all message with status -1 .(status displayed should be sent .
           // and modify the status sent .
    //     // set variable to fixed value 
          self.chatSDK.PingCount=0;
          var offmessageArray= LocalCache.getAllPendingMessages();       
           var jid;
           var mid;
           var body;
           var timeInMilliSecond;
           var strTimeMii;
           var message;

           if(offmessageArray == null || offmessageArray === undefined ){
                utility.comn.consoleLogger("All Pending Messages Count:" + "0");
           }
           else{
             utility.comn.consoleLogger("All Pending Messages Count : " + offmessageArray.length);
            for (var i=0 ; i < offmessageArray.length ; i++){
                 utility.comn.consoleLogger('tegoid ' + offmessageArray[i]['tegoid']+ ' mid '+offmessageArray[i]['mid']+ 'body '+ offmessageArray[i]['body'])
                jid=offmessageArray[i]['tegoid']+'@' + constants.Url.chatServerURl;
                mid=offmessageArray[i]['mid'];
                body=offmessageArray[i]['body'];
                message = $msg({to: jid, "type": "chat", "id": mid}).c('body').t(body).up().c('active', {xmlns: "http://jabber.org/protocol/chatstates"}).up()
                .c('request', {xmlns: 'urn:xmpp:receipts'}).up().c('meta').c('acl', {deleteafter: "-1", canforward: "1", candownload: "1"});
                self.chatSDK.connection.send(message);
               timeInMilliSecond = getTimeInLongString();
               strTimeMii = timeInMilliSecond.toString();
             //   utility.comn.consoleLogger(' local cache message status upadted from mid '+mid);
               LocalCache.updateMessageStatus(mid, 0, Strophe.getNodeFromJid(jid), strTimeMii);
            }
           }
          return true;
       },
        send_ping : function(to){
          //   utility.comn.consoleLogger('to from send ping'+ to);
            var ping = $iq({to: to,type: "get",id: "ping1"}).c("ping", {xmlns: "urn:xmpp:ping"});
             utility.comn.consoleLogger('send_ping Called :' +  "to: " + to );
            
           self.chatSDK.pingRef= setInterval(function (){
                 self.chatSDK.connection.send(ping);                
             },1000);
            
       },
        ping_handler_readACK : function (iq){
               if(self.chatSDK.kill=="Yes"){
                   return false;
               }
                if (self.chatSDK.readACKO.length > 0 ) {
                var infoObjec=self.chatSDK.readACKO.shift();
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
                    self.chatSDK.connection.send(message2);
                }
                self.chatSDK.scroll_chat(jid_id);
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
