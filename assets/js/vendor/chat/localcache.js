/*
 Project         :Jarvis
 Module          :JS file for Chat SDK
 Source file name:ChatSDK.js
 Description     :Chat SDK. 
 Written By      :Mahesh Kumar G
 Copyright       :Copyright © 2012, paytm. Written under contract by Robosoft Technologies Pvt. Ltd.
 History         :
 */
/*
 *Defeine data structure for LocalCache
 */
var LocalCache = {
    tigoid: null,
    password: null,
    sessionid: null,
    plustxtid: null,
    loginusername: null,
    xmpporapi: 1,
    plustxtcacheobj: {},
    /*
     * Function             : clearCache(inplustxtid)
     * Description          : To get server data and store it in locally
     * Input Param          : inpluxtxtid: Plustxt id of the login user
     * Output Param         : none
     */
    clearCache: function(inplustxtid)
    {
        var plustxtref = "Plustx_" + inplustxtid;
        $.jStorage.deleteKey(plustxtref)
        LocalCache.tigoid = null;
        LocalCache.sessionid = null;
        LocalCache.plustxtid = null;
        LocalCache.loginusername = null;
    },

    logHistoryOfContact: function(Result, customer, agent ){
        var messagelist = Result.data.messages;
        chatHistory = [];
        $.each(messagelist, function(ind, val){
            
            //if(val.sender == agent || val.receiver == agent){
                var message = {};
                var state = "Sending";
                message.sender = val.sender;
                message.receiver = val.receiver;
                message.conversation = decode64(val.txt);
                message.mid = val.mid;
                message.sent_on = getLocalTime(val.sent_on);
                if(val.read_on){
                    message.read_on = getLocalTime(val.read_on);
                }
                else{
                    message.read_on = "Not Available";
                }
                message.last_ts = getLocalTime(val.last_ts);
                if(val.read_on != undefined){
                    message.state = "Read";
                }
                else if(val.received_on != undefined){
                    message.state = "Delivered";
                }
                else if(val.sent_on != undefined){
                    message.state = "Sent";
                }

                if(agent != ""){
                    if(val.sender == agent || val.receiver == agent){
                        chatHistory.push(message);
                    }
                }
                else{
                    chatHistory.push(message);
                }
            
        })
        return chatHistory;
    },

    syncUserHitory : function(Result, contact){
        var userTegoId = contact.tegoid;
        var MessageList = Result.data.messages;
        var contactobj;
        var emailobj;
        //Pushing Message object details
        var messageobj;
        var otherpartyid;
        var otherpartyplustxtid;
        var Result;
        var contactmessagearray = [];
        var historyobj = {};
        var lastMessage, lastmessagetimestamp;

        var state = 0;
        for (var key in MessageList){
            state = 0;
            messageobj = {};
            messageobj['deleted_on_sender'] = MessageList[key]['deleted_on_sender'];
            messageobj['sender'] = MessageList[key]['sender'];
            messageobj['receiver'] = MessageList[key]['receiver'];
            messageobj['can_forward'] = MessageList[key]['can_forward'];
            messageobj['delete_after'] = MessageList[key]['delete_after'];
            messageobj['last_ts'] = MessageList[key]['last_ts'];
            messageobj['sent_on'] = MessageList[key]['sent_on'];
            try{
                messageobj['txt'] = decode64(MessageList[key]['txt']);
            }
            catch(e){
                
            }
            messageobj['id'] = MessageList[key]['id'];
            messageobj['mid'] = MessageList[key]['sender'] + "-c-" + MessageList[key]['sent_on'];
            messageobj['flags'] = 0;//0-sent;1-recieved
            //{"deleted_on_sender":"False","sender":"2zes66","can_forward":"True","mid":"2zes66-c-1380181404841","received_on":"1380181422","can_download":"True","delete_after":"-1","last_ts":"1380181526","read_on":"1380181526","receiver":"lx03lz","sent_on":"1380181420","txt":"aGVsbG8gcGV0ZXIgaG93IGFyZSB5b3Ug","deleted_on_receiver":"False","id":"21484"}
            if (MessageList[key]['read_on'] != undefined)
                state = 3;
            else if (MessageList[key]['received_on'] != undefined)
                state = 2;
            else if (MessageList[key]['sent_on'] != undefined)
                state = 1;
            else
                state = 0;
            messageobj['state'] = state;//0-sending;1-sent;2-Delivered;3-read
            if(MessageList[key]['sender'] != undefined){
                contactmessagearray.push(messageobj);
                LocalCache.plustxtcacheobj['message'][userTegoId] = contactmessagearray;
            }
        }

        var plustxtref = "Plustx_" + LocalCache.plustxtid;
        var value = $.jStorage.get(plustxtref, null);
        //if (value == null)
            $.jStorage.set(plustxtref, LocalCache.plustxtcacheobj);
    },
    /*
     * Function             : getAPIData_StoreLocally(inpluxtxtid)
     * Description          : To get server data and store it in locally
     * Input Param          : Result: JSON result contains API response for getAllConversation
     * Output Param         : none
     */
    getAPIData_StoreLocally: function(ContactList)
    {
        //alert(JSON.stringify(Result));
        var MessageList = [];
       // MessageList = Result.data.messages;
        //alert(JSON.stringify(MessageList));
//        plustxtcacheobj={};        
//        plustxtcacheobj['contact']={};
//        plustxtcacheobj['message']={};
        LocalCache.plustxtcacheobj['contact'] = {};
        LocalCache.plustxtcacheobj['message'] = {};
        LocalCache.plustxtcacheobj['history'] = {};
        var contactobj;
        var emailobj;
        //Pushing Message object details
        var messageobj;
        var otherpartyid;
        var otherpartyplustxtid;
        var Result;
        var contactmessagearray = [];
        var historyobj = {};
        var lastMessage, lastmessagetimestamp;
        // var messagearray=[];
        var state = 0;
        for (var key in MessageList)
        {
            state = 0;
            if (MessageList[key]['sender'] == LocalCache.tigoid)
                otherpartyid = MessageList[key]['receiver'];
            else
                otherpartyid = MessageList[key]['sender'];
            otherpartyplustxtid = otherpartyid + "@" + constants.Url.chatServerURl;

            //alert('otherpartyid-->'+otherpartyid);
            messageobj = {};
            messageobj['deleted_on_sender'] = MessageList[key]['deleted_on_sender'];
            messageobj['sender'] = MessageList[key]['sender'];
            messageobj['receiver'] = MessageList[key]['receiver'];
            messageobj['can_forward'] = MessageList[key]['can_forward'];
            messageobj['delete_after'] = MessageList[key]['delete_after'];
            messageobj['last_ts'] = MessageList[key]['last_ts'];
            messageobj['sent_on'] = MessageList[key]['sent_on'];
            try{
                messageobj['txt'] = decode64(MessageList[key]['txt']);
            }
            catch(e){
                
            }
            messageobj['id'] = MessageList[key]['id'];
            messageobj['mid'] = MessageList[key]['sender'] + "-c-" + MessageList[key]['sent_on'];
            messageobj['flags'] = 0;//0-sent;1-recieved
            //{"deleted_on_sender":"False","sender":"2zes66","can_forward":"True","mid":"2zes66-c-1380181404841","received_on":"1380181422","can_download":"True","delete_after":"-1","last_ts":"1380181526","read_on":"1380181526","receiver":"lx03lz","sent_on":"1380181420","txt":"aGVsbG8gcGV0ZXIgaG93IGFyZSB5b3Ug","deleted_on_receiver":"False","id":"21484"}
            if (MessageList[key]['read_on'] != undefined)
                state = 3;
            else if (MessageList[key]['received_on'] != undefined)
                state = 2;
            else if (MessageList[key]['sent_on'] != undefined)
                state = 1;
            else
                state = 0;
            messageobj['state'] = state;//0-sending;1-sent;2-Delivered;3-read
      
            if (LocalCache.plustxtcacheobj['message'].hasOwnProperty(otherpartyid))
            {
                contactmessagearray = LocalCache.plustxtcacheobj['message'][otherpartyid];
                contactmessagearray.push(messageobj);
            }
            else
            {
                contactmessagearray = [];
                contactmessagearray.push(messageobj);
            }
            LocalCache.plustxtcacheobj['message'][otherpartyid] = contactmessagearray;

            //creating history object
            historyobj = {};
            lastMessage = "";
            lastmessagetimestamp = 0;
            for (var index1 = 0; index1 < contactmessagearray.length; index1++) {
                if (contactmessagearray[index1]['sent_on'] > lastmessagetimestamp && contactmessagearray[index1]['sender'] != LocalCache.tigoid) {
                    lastmessagetimestamp = contactmessagearray[index1]['sent_on'];
                    lastMessage = contactmessagearray[index1]['txt'];
                }
            }
            //historyobj['jid']=key;
            if (lastmessagetimestamp != 0) {
                historyobj['last_message'] = lastMessage;
                historyobj['time_stamp'] = lastmessagetimestamp;
                LocalCache.plustxtcacheobj['history'][otherpartyid] = historyobj
            }


            //---------------------------------------------------------
        }
        //alert("LocalCache.plustxtcacheobj['message'] "+JSON.stringify(LocalCache.plustxtcacheobj['message']))
        //Push Contact information to local cache----------------- 
        for (var key in ContactList)
        {
            otherpartyid = "";
            otherpartyid = ContactList[key]['tegoid'];
            contactobj = {};
            contactobj['plustxtid'] = ContactList[key]['plustxtid'];
            contactobj['name'] = ContactList[key]['name'];
            contactobj['thumbnail_image_file'] = "";
            contactobj['is_blocked'] = 0;
            contactobj['is_sms'] = 0;
            contactobj['status'] = 0;
            contactobj['status_msg'] = "offline";
            contactobj['last_seen'] = "";
            //Get Contact details--------------------                
            try
            {
                Result = getDetails(otherpartyid);
                contactobj['username'] = Result.data['email'];
                contactobj['name'] = decode64(Result.data['name']);
                console.log('from local cache checking the contact' + otherpartyid + '=result= ' + JSON.stringify(Result));
            }
            catch (err) {
                console.log('error in fetching email for tegoid' + otherpartyid);
            }

            //Set Email details for each contact inside contact obj
            /* contactobj['email']=[];        
             for(var k=0;k<5;k++)
             {
             emailobj={};
             emailobj['emailid']="mahesh.kumar@robosoftin.com";
             contactobj['email'].push(emailobj);
             }   
             */
            if (LocalCache.plustxtcacheobj['contact'].hasOwnProperty(otherpartyid))
            {
                //  alert('has property');
            }
            else
            {
                LocalCache.plustxtcacheobj['contact'][otherpartyid] = contactobj;
            }
        }
        //alert(JSON.stringify(plustxtcacheobj['message']));
        //alert('contact---->'+JSON.stringify(plustxtcacheobj['contact']));

        //---- Push All Contacts to local cached -------
        //Pushing contact list 
        /*for(var i=0;i<5;i++)
         {
         contactobj={};
         contactobj['plustxtid']=i;
         contactobj['name']="mahesh"+i;    
         contactobj['thumbnail_image_file']="";  
         contactobj['is_blocked']=0;
         contactobj['is_sms']=0;
         contactobj['status']=0;
         contactobj['status_msg']="Active";
         contactobj['last_seen']=11111121;
         
         //Set Email details for each contact inside contact obj
         contactobj['email']=[];        
         for(var k=0;k<5;k++)
         {
         emailobj={};
         emailobj['emailid']="mahesh.kumar@robosoftin.com";
         contactobj['email'].push(emailobj);
         }            
         plustxtcacheobj['contact'].push(contactobj);
         }
         */
        console.log("LocalCache.plustxtcacheobj " + JSON.stringify(LocalCache.plustxtcacheobj));

        var plustxtref = "Plustx_" + LocalCache.plustxtid;
        var value = $.jStorage.get(plustxtref, null);
        if (value == null)
            $.jStorage.set(plustxtref, LocalCache.plustxtcacheobj);

        //---------------------Get Contact Array and display ---------------------
        //var r_contactobj=value['contact'];
        //var r_emailobj;
        //var itr_contactobj;
        //var itr_emailobj;
        //for(itr_contactobj in r_contactobj)
        //{
        //alert(JSON.stringify(r_contactobj[itr_contactobj]));
        /*
         r_emailobj=r_contactobj[itr_contactobj]['email']
         for(itr_emailobj in r_emailobj)
         {
         alert(r_emailobj[itr_emailobj]['emailid']);
         }  
         */
        //}
        //-------------------- Contact Array Ends here ---------------------


        //---------------------Get All Conversation from contact ---------------------
        //   var r_messageobj=value['message'];
        //   var itr_messageobj;
        //alert(JSON.stringify(r_messageobj['ywhah8']));             
        //-------------------- Contact Array Ends here ---------------------
    },
    /*
     * Function             : addMessage()
     * Description          :Adds message to local cache
     * Input Param          : inSenderJID->JID of sender,inRecieverJID->JID of reciever,inMessage->text
     * Output Param         : none
     */
    addMessage: function(inRecieverJID, inSenderJID, inMessage, inTime, mid)
    {
        var otherpartyid;
        //console.log(" LocalCache.tigoid " + LocalCache.tigoid);
        var plustxtid = "Plustx_" + LocalCache.tigoid + "@" + constants.Url.chatServerURl;;
        //console.log("plustxtid " + plustxtid);
        LocalCache.plustxtcacheobj = $.jStorage.get(plustxtid);
        var messagelist = [];
        var receivertigoId = inRecieverJID.substring(0, inRecieverJID.lastIndexOf('@'));
        var sendertigoId = inSenderJID.substring(0, inSenderJID.lastIndexOf('@'));
        //console.log("MessageList " + JSON.stringify(LocalCache.plustxtcacheobj));
        var messageobj = {};
        messageobj['deleted_on_sender'] = "false";//MessageList[key]['deleted_on_sender'];
        messageobj['sender'] = sendertigoId;
        messageobj['receiver'] = receivertigoId;
        messageobj['can_forward'] = "true";//MessageList[key]['can_forward'];
        messageobj['delete_after'] = "-1";//MessageList[key]['delete_after'];
        messageobj['last_ts'] = inTime;//MessageList[key]['last_ts'];
        messageobj['sent_on'] = inTime;//MessageList[key]['sent_on'];
        messageobj['txt'] = inMessage//MessageList[key]['txt'];
        messageobj['id'] = "";
        messageobj['mid'] = mid;
        messageobj['flags'] = 0;//0-sent;1-recieved
        messageobj['state'] = 0;//0-sending;1-sent;2-Delivered;3-read

        if (receivertigoId == LocalCache.tigoid)
            otherpartyid = sendertigoId;
        else
            otherpartyid = receivertigoId;

        if (LocalCache.plustxtcacheobj['message'].hasOwnProperty(otherpartyid))
        {
            //console.log("inside if")
            messagelist = LocalCache.plustxtcacheobj['message'][otherpartyid];
            messagelist.push(messageobj)
        }
        else {
            //console.log("inside else" + JSON.stringify(messageobj))
            messagelist = [];
            messagelist.push(messageobj);
        }
        //console.log("after  else message list "+JSON.stringify(messagelist));           
        LocalCache.plustxtcacheobj['message'][otherpartyid] = messagelist;

        //updating history
        if (messageobj['sender'] != LocalCache.tigoid)
        {
            var historyobj = {};
            historyobj['last_message'] = messageobj['txt'];
            historyobj['time_stamp'] = messageobj['sent_on'];
            LocalCache.plustxtcacheobj['history'][otherpartyid] = historyobj
        }
        //console.log("MessageList after " + JSON.stringify(LocalCache.plustxtcacheobj));
        $.jStorage.set(plustxtid, LocalCache.plustxtcacheobj);
        //console.log(JSON.stringify(LocalCache.plustxtcacheobj['message'][LocalCache.tigoid]))
    },
    /*
     * Function             : addContact()
     * Description          :
     * Input Param          : 
     * Output Param         : none
     */
    addContact: function(Result, emailid)
    {
        var plustxtid = "Plustx_" + LocalCache.plustxtid;
        var plustxtobject = $.jStorage.get(plustxtid);
        //console.log('before plustxt object' + JSON.stringify(plustxtobject));
        var contactarray = plustxtobject['contact'];
        if (contactarray.hasOwnProperty(Result.data['tego_id']))
        {
        }
        else
        {
            contactobj = {};
            contactobj['plustxtid'] = Result.data['tego_id'] + "@" + constants.Url.chatServerURl;
            contactobj['username'] = emailid;
            contactobj['name'] = decode64(Result.data['name']);
            contactobj['thumbnail_image_file'] = "";
            contactobj['is_blocked'] = 0;
            contactobj['is_sms'] = 0;
            contactobj['status'] = 0;
            contactobj['status_msg'] = "offline";
            contactobj['last_seen'] = "";
            contactarray[Result.data['tego_id']] = contactobj;
        }
        plustxtobject['contact'] = contactarray;
       // console.log('After' + JSON.stringify(plustxtobject['contact']));
        $.jStorage.set(plustxtid, plustxtobject);
    },
    /*
     * Function             : updateMessageStatus()
     * Description          :updates the message status
     * Input Param          : inmessageid,instatus,inotherpartytigoid
     * Output Param         : none
     */
    updateMessageStatus: function(inmessageid, instatus, inotherpartytigoid, intime)
    {
        var plustxtid = "Plustx_" + LocalCache.plustxtid;
        var plustxtobject = $.jStorage.get(plustxtid);
        var messagearray = [];
        messagearray = plustxtobject['message'][inotherpartytigoid];
        //console.log("inotherpartytigoid "+inotherpartytigoid+"messagearray "+JSON.stringify(messagearray));
        // var messagearray=messageobject.inmessageid;
        for (var key in messagearray)
        {
            if (messagearray[key]['mid'] == inmessageid) {
                messagearray[key]['state'] = instatus;
                messagearray[key]['last_ts'] = intime;
            }
        }
        plustxtobject['message'][inotherpartytigoid] = messagearray
        //console.log("after updateinotherpartytigoid " + inotherpartytigoid + "messagearray " + JSON.stringify(plustxtobject['message'][inotherpartytigoid]));
        $.jStorage.set(plustxtid, plustxtobject);
    },
    /*
     * Function             : updateMessageStatusAsRead()
     * Description          : updates the message status when left pamel contact is selected
     * Input Param          : inotherpartytigoid,intime
     * Output Param         : none
     */
    updateMessageStatusAsRead: function(inotherpartytigoid, intime)
    {
        var plustxtid = "Plustx_" + LocalCache.plustxtid;
        var plustxtobject = $.jStorage.get(plustxtid);
        var messagearray = [];
        var midread = new Array();
        messagearray = plustxtobject['message'][inotherpartytigoid];
        //  console.log("inotherpartytigoid "+inotherpartytigoid+"messagearray "+JSON.stringify(plustxtobject['message'][inotherpartytigoid]));
        // var messagearray=messageobject.inmessageid;
        for (var key in messagearray)
        {
            if (messagearray[key]['state'] == 2 && messagearray[key]['sender'] == inotherpartytigoid) {
                messagearray[key]['state'] = 3;
                messagearray[key]['last_ts'] = intime;
                midread[midread.length] = messagearray[key]['mid'];
            }
        }
        plustxtobject['message'][inotherpartytigoid] = messagearray;
        //console.log(JSON.stringify(midread));
        //console.log("after updateinotherpartytigoid " + inotherpartytigoid + "messagearray " + JSON.stringify(plustxtobject['message'][inotherpartytigoid]));
        $.jStorage.set(plustxtid, plustxtobject);
        return midread;
    },
    
    /*
     * Function             : getAllPendingMessages()
     * Description          : To get all offline messages which are in pending status
     * Input Param          : NA
     * Output Param         : none
     */
    getAllPendingMessages: function()
    {
        var plustxtid = "Plustx_" + LocalCache.plustxtid;
        var plustxtobject = $.jStorage.get(plustxtid);
        var messagearray = [];
        var offlinemessage;
        var midread = new Array();
        MessageList=plustxtobject['message'];
        for (var key in MessageList)
        {
            messagearray = plustxtobject['message'][key];
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
    }
};

   function getLocalTime (timestamp){
        var sent_on = new Number(timestamp + '000');
        var messageTimeDescription = milliTimeToString2(sent_on);
        return messageTimeDescription;
    }

    function milliTimeToString2 (inMilliSeconds) {
        var date = new Date(inMilliSeconds);
        var strTime = utility.comn.parseDate(date) + " "+ utility.comn.parseTime(date);
        return strTime;
    }
/*
 * Function             : encode64()
 * Description          : This function will let you encode Base64 encoded text.
 * Input Param          : input
 * Output Param         : 
 */
function encode64(input) {
    var output = new StringMaker();
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output.append(keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4));
    }
    return output.toString();
}
/*
 * Function             : decode64()
 * Description          : This function will let you decode Base64 encoded text.
 * Input Param          : input
 * Output Param         : 
 */
function decode64(input) {
    var output = new StringMaker();
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output.append(String.fromCharCode(chr1));
        if (enc3 != 64) {
            output.append(String.fromCharCode(chr2));
        }
        if (enc4 != 64) {
            output.append(String.fromCharCode(chr3));
        }
    }
    return output.toString();
}
//--------- Library to encode and decode source code ------------------------------------------
var ua = navigator.userAgent.toLowerCase();
var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
if (ua.indexOf(" chrome/") >= 0 || ua.indexOf(" firefox/") >= 0 || ua.indexOf(' gecko/') >= 0) {
    var StringMaker = function() {
        this.str = "";
        this.length = 0;
        this.append = function(s) {
            this.str += s;
            this.length += s.length;
        }
        this.prepend = function(s) {
            this.str = s + this.str;
            this.length += s.length;
        }
        this.toString = function() {
            return this.str;
        }
    }
} else {
    var StringMaker = function() {
        this.parts = [];
        this.length = 0;
        this.append = function(s) {
            this.parts.push(s);
            this.length += s.length;
        }
        this.prepend = function(s) {
            this.parts.unshift(s);
            this.length += s.length;
        }
        this.toString = function() {
            return this.parts.join('');
        }
    }
}
//----------------------------------------------------------------------------------------------

//LocalCache.tigoid=11;
//getAPIData_StoreLocally(LocalCache.tigoid);