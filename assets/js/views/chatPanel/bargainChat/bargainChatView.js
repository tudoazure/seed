"use strict";

ChatPanel.Views.BargainChatView = Backbone.View.extend({

  el: constants.common.BargainChatTab,
  template: null,  
  chatSDK : null,
  coreAPI : null,
  bargainProduct : null,
  guestUserId: null,
  ProgresBar : {
    showProgressvalue : "",
    disableProgressValue :"none",
    continueLogin :"No"
  },
  events: {
    "keypress .inputChatBox" : "onChatInputKeypress",
    "focus .inputChatBox" :  "onChatInputFocus",
    "click .chatListDiv" : "onChatListClick",
    "click .chatHistoryFetch" : "onChatHistoryClick",
    "click .closeChat" : "onCloseChatClick",
    "click .createPromoCode" : "openPromoPopUp",
    "click #createPromo" : "savePromoCode",
    "click .enableChatWindow" : "enableChatUserWindow",
    'change input[type="radio"][name="promoType"]': 'toggleDetail',
    'click .dummyHistoryLink' : "getTestHistory",
    'click .detailProduct' : 'itemLinkClick'
  },

  initialize: function(){
      this.template = _.template($("#bargainChat-template").html());
      _.bindAll(this, 'render');
      this.render();
  },

  render: function(url){
    utility.comn.consoleLogger('Render Called');
    this.guestUserId = 0;
    this.bargainProduct = null;
    this.getChatSDK();
    this.getCoreAPI();
    this.$el.html(this.template());
    if(ChatPanelUser && ChatPanelUser.token ){
      this.connect("", "", $.trim(ChatPanelUser.email), $.trim(ChatPanelUser.email), "91", ChatPanelUser.token);
    }
    else{
       utility.comn.consoleLogger(ChatPanelUser);
      alert('Going to log out now.')
       window.location.href = '/adminlogout';
    }
    return this;
  },

  close: function(){
    this.disconnectChat();
    this.$el.empty();
    this.unbind();
  },

  disconnectChat : function () {
    utility.comn.consoleLogger('Disconnect Chat Called');
    if(this.chatSDK){
      this.chatSDK.kill="Yes";
      $.jStorage.deleteKey('reLoadObject');
      clearInterval(this.chatSDK.sendPingRef);
      showProgress();
      if(this.chatSDK && this.chatSDK.connection){
       this.chatSDK.connection.disconnect();
      }
      this.chatSDK.connection = null;
      $('#roster-area ul').empty();
      $('#chatListDiv').empty();
      $('#content div').remove();
      this.chatSDK.openedChatDiv = {};
      this.chatSDK.contact_subsription = {};
      this.chatSDK.nameList = {};
      // Clear the cache.
      this.ProgresBar.continueLogin="No";
      this.clearCachedDatabase(LocalCache.plustxtid);
   }
  },

  itemLinkClick : function(event){
    var elem = $(event.target);
    
    var modalWindow = this.$el.find('#productDetail');
    var jid = elem.parent().find('textarea').attr('name');
    var bargainProduct = this["bargainProduct-"+jid];
    if(bargainProduct){
      var self = this;
      var productDetail = new ChatPanel.Models.ProductDetail();
      productDetail.fetch({
        xhrFields: {withCredentials:true},
        url: constants.Url.ProductCRUD.format({merchantId : bargainProduct.merchant_id})+ bargainProduct.id ,
        success : function(data){
          productDetail = productDetail.toJSON();
          var template = _.template( $('#itemDetail-template').html());
          modalWindow.find('#itemBody').empty();
          modalWindow.find('#itemBody').append(template(productDetail));
          modalWindow.modal('show');
        }, 
        error : $.proxy(function(){
          utility.comn.showNotification("catalogAlert-div", "Sorry your request could not be processed right now. Please try later.", "error");
        }, this)
      });

    }
  },

  onCloseChatClick : function(e){
    var chatTextArea = $(e.currentTarget).parent().find(".inputChatBox");
    var isChatAreaDisabled = chatTextArea.prop('disabled');
    var jid = chatTextArea.attr('name');
    var jid_id = this.chatSDK.jid_to_id(jid);
    if(!isChatAreaDisabled){
      var body = {"CLSCHAT" : "chat closed" };
      body = JSON.stringify(body);
      chatTextArea.prop('disabled', true);
      this.$el.find("#ChatDiv-" + jid_id).find('.createPromoCode').addClass('disabled');
      this.sendChatMessages(body, jid, jid_id);
    }
    this.$el.find("#ChatDiv-" + jid_id).hide();
    this.$el.find('#ChatListDiv-' + jid_id).next().hide();
    this.$el.find('#ChatListDiv-' + jid_id).hide();
  },

  disableChatUser : function(jid_id){
    this.$el.find("#ChatDiv-" + jid_id).find('.createPromoCode').addClass('disabled');
    this.$el.find("#InputBox-" + jid_id).prop('disabled', true);

  },

  enableChatUserWindow : function(e){
    var chatTextArea = $(e.currentTarget).parent().find(".inputChatBox");
    var jid = chatTextArea.attr('name');
    var jid_id = this.chatSDK.jid_to_id(jid);
    this.enableChatUser(jid_id);
  },

  enableChatUser : function(jid_id){
    if(this.$el.find("#ChatDiv-" + jid_id).find('.createPromoCode').hasClass('disabled')){
      this.$el.find("#ChatDiv-" + jid_id).find('.createPromoCode').removeClass('disabled');
      this.$el.find("#InputBox-" + jid_id).prop('disabled', false);
    }
  },

  // For debugging conversations between two people
  getTestHistory: function(){
    var url = constants.Url.ChatHistory;
    var customer = $.trim(this.$el.find('.user1').val()); 
    if(customer == ""){
      alert("Fill up User 1 Plustxt Id");
      return;
    }
    var agent = $.trim(this.$el.find('.user2').val());
    postdata = {};
    postdata["converser"] = customer 
    postdata["session_id"] = LocalCache.sessionid;
    postdata["merchant_id"] = 1;
    postdata = $.param(postdata);
    var Result = this.coreAPI.getAPIResult(url, postdata);
    var chatHistory = LocalCache.logHistoryOfContact(Result, customer, agent);
    if(chatHistory){
      var modalWindow = this.$el.find('#chatHistoryModal');
      var chatContainer = modalWindow.find('#chatTable');
      $(chatContainer).empty();
      $.each(chatHistory, function(i,v){
        if(v){
          $(chatContainer).append('<tr><td class="break-word alignleft font13 span3">'+v.conversation+ '</td><td>' +v.sender+'</td><td>'+v.receiver+'</td><td>'+v.state+'</td><td>'+v.sent_on+'</td><td>' +v.read_on + '</td><td>'+v.last_ts+'</td><td>'+v.mid+'</td></tr>');
        }
      })
      $("#chatHistoryModal").modal('show');
    }
  },

  onChatHistoryClick : function(event){
    utility.comn.consoleLogger('Chat History Link Clicked');
    var userIdArray = $(event.target).attr('id').split('-');
    var plustxtid = $(event.target).attr('name');
    var customerName = $.trim($(event.target).parent().find(".labelClassT").text().replace("Customer : ", ""));
    var userId = "";
    var contactlist = {};
    if(userIdArray.length){
      userId = userIdArray[1];
    }
    contactlist = { plustxtid : plustxtid , name : "", tegoid : userId};
    // alert("history");
    // userId = userId.split('-')
    var url = constants.Url.ChatHistory;
    postdata = {};
    postdata["converser"] = userId;
    postdata["session_id"] = LocalCache.sessionid;
    postdata["merchant_id"] = 1;
    postdata = $.param(postdata);
    var Result = this.coreAPI.getAPIResult(url, postdata);
    LocalCache.syncUserHitory(Result, contactlist);
    userIdArray = userIdArray.slice(1, userIdArray.length);
    var jid_id = userIdArray.join('-');
    this.insert_Message(jid_id, plustxtid , customerName, userId, true);
    this.chatSDK.scroll_chat(jid_id);
  },

  clearCachedDatabase : function(inplustxtid){
    utility.comn.consoleLogger('Local Cache Cleared ');
    LocalCache.clearCache(inplustxtid);
  },


  openPromoPopUp : function(event){
    var elem = $(event.target);
    if(elem.hasClass('disabled')){
      alert("Promo Code can't be generated for this customer/product.");
      return;
    }
    var modalWindow = this.$el.find('#promoCodeModal');
    modalWindow.find('.error').hide();
    modalWindow.find('input[type="text"]').val('');
    modalWindow.find('#promoValidDate').datetimepicker({
      language: 'en',
        pick12HourFormat: true
    });
    var textareaId = elem.parent().find('textarea').attr('id');
    var name = elem.parent().find('textarea').attr('name');
    modalWindow.find('#chatTextBoxId').attr('name', name)
    modalWindow.find('#chatTextBoxId').val(textareaId);
    this.$el.find('.numeric').numeric({decimal: false, negative : false });
    this.$el.find('#createPromo').attr('disabled',false);
    $("#promoCodeModal").modal('show');
  },

  toggleDetail: function(event){
    var radioVal = $(event.target).attr('value');
    if(radioVal == 'freeshipping'){
      this.$el.find('#promoCodeModal').find('#freeShipDiv').hide();
    }else{
      this.$el.find('#promoCodeModal').find('#freeShipDiv').show();
    }
  },

  validatePromoData : function(promoObj){
    var isValid = true;
    if(promoObj){
      if(promoObj.action == "percentage"){
        if(!promoObj.value ){
          isValid = false;
          this.$el.find('#promoCodeModal').find('#percentageTextError').show()
        }
        if(!promoObj.cap){
          isValid = false;
          this.$el.find('#promoCodeModal').find('#capTextError').show()
        }
      }else if(promoObj.action == "absolute"){
        if(!promoObj.value){
          this.$el.find('#promoCodeModal').find('#absoluteTextError').show()
        }
      }
    }
    return isValid;
  },

  savePromoCode : function(event){
    
    this.$el.find('#promoCodeModal').find('.error').hide();
    var self = this;
    var isValidPromo = true;
    var modalWindow = this.$el.find('#promoCodeModal');
    var action = modalWindow.find('input[type="radio"][name="promoType"]:checked').val();
    var cap = action == 'percentage' ? modalWindow.find('#capText').val(): "";
    var value = (action == 'percentage') ? modalWindow.find('#percentageText').val() : ((action == 'absolute') ? modalWindow.find('#absoluteText').val() : "" )
    var minQty = modalWindow.find('#minQtyText').val();
    var validDate =   modalWindow.find('#promoValidDateText').val().trim();
    var freeshipping = action == 'freeshipping' ? true : modalWindow.find('input[type="checkbox"]').prop('checked');
    var jid = modalWindow.find('#chatTextBoxId').attr('name');
    var message = modalWindow.find('#successText').val().trim();
    if(validDate){
      validDate = validDate.replace( /(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3");
      validDate = new Date(validDate).getTime();
    }
    var bargainProduct = this["bargainProduct-"+jid];
    var promoObj = {
      action : action,
      value : value,
      cap : cap, 
      qty : minQty,
      freeshipping : freeshipping,
      product_id : bargainProduct ? (bargainProduct.id||0) : 0,
      user_id : bargainProduct ? (bargainProduct.user_id||0) : 0,
      valid_upto : validDate, 
    };
    isValidPromo = this.validatePromoData(promoObj);

    if(isValidPromo && promoObj.user_id){
      $(event.target).attr('disabled',true);
      $.ajax({
      url : constants.Url.BargainPromo,
      xhrFields: {withCredentials:true},
      type : 'POST',
      data: JSON.stringify(promoObj),
      dataType: 'json',
      contentType: 'application/json',
      success: function(data){
        if(data){
          var promoCodeData = {message : message.trim(),
            promocode : data.code,
            validity : utility.comn.parseDate(data.valid_upto) + " | " + utility.comn.parseTime(data.valid_upto),
            minQuantity : minQty
          }
          var body = {PRMCODE: promoCodeData} ;
          body = JSON.stringify(body);
           // message.trim() + " USE PROMO CODE: " +data.code + " VALID TILL : " + utility.comn.parseDateTime(data.valid_from) ;
          //var jid = modalWindow.find('#chatTextBoxId').attr('name');
          var jid_id = self.chatSDK.jid_to_id(jid);
          self.sendChatMessages(body, jid, jid_id);
        }
        $("#promoCodeModal").modal('hide');
        $(event.target).attr('disabled',false);
      },
      error: function(err){
          alert("Sorry, some error while creating promocode. Please try later.");
          $(event.target).attr('disabled',false);
        },
      });
    }

  },

  connect : function(firstName, lastName, email, phone, countrycode,accesstoken){
    utility.comn.consoleLogger("Connect Called with token: " + accesstoken);
    var self = this;
    var deviceid = navigator.userAgent;
    url = constants.Url.ChatConnect;
    postdata = {};
    postdata["first_name"] = firstName;
    postdata["last_name"] = lastName;
    postdata["email"] = email;
    postdata["phone"] = phone;
    postdata["country_code"] = countrycode;
    postdata["device_id"] = deviceid;
    postdata["device_type"] = "Android";
    postdata["device_detail"] = "none+details";
    postdata["device_token"] = "TOKEN";
    postdata["utype"] = "Normal";
    postdata["access_token"] = accesstoken;
    postdata = $.param(postdata);
    $.ajax({
      type: "POST",
      data: postdata,
      url : url ,
      cache :false,
      crossDomain: true,
      wait: true,
      success : function(data){
        var Result = JSON.parse(data);
        LocalCache.tigoid = Result.data['tego_id'];
        LocalCache.sessionid = Result.data['session_id'];
        LocalCache.plustxtid = Result.data['tego_id'] + "@" + constants.Url.chatServerURl;
        self.connectTrigger( {
                    jid: LocalCache.plustxtid,
                    password: Result.data['password'] + LocalCache.tigoid.substring(0, 3)
        });

        self.getDetails(LocalCache.tigoid);
      },
      error : function(error){
        console.log("Connect Called Failed");
      }
    });
  },

  /*
   function    : getDetails()
   parameters  : tegoid
   description : Gets all the messages (both sent and received) exchanged with the all users
   : Decode the JSON response and store data locally
   : 
   */
  getDetails : function(tegoid){
    var self   = this;
    url =  constants.Url.chatUserDetails + tegoid + "/";
    postdata = {};
    postdata["session_id"] = LocalCache.sessionid;
    postdata = $.param(postdata);
    $.ajax({
      type: "POST",
      data: postdata,
      url : url ,
      cache :false,
      crossDomain: true,
      wait: true,
      success : function(data){
        var UserDetails = JSON.parse(data);
        LocalCache.loginusername = decode64(UserDetails.data['name']);
        self.updateLoginName(decode64(UserDetails.data['name']));
        self.reLoginOrNormalFunction();
      },
      error : function(error){
        console.log("User Details Could not be fetched");
      }
    });
  },

  connectTrigger : function(data){
    var self = this;
    self.chatSDK.connection = null;
    var conn = new Strophe.Connection(connectionURL);
    conn.connect(data.jid, data.password, function(status) {
        if (status === Strophe.Status.CONNECTED) {
            self.logConnectTriggerStatus("CONNECTED", status);
            self.$el.find("#infoHeader").removeClass("agentConnecting").removeClass("agentDisconnected").addClass("agentOnilne");
            self.chatSDK.connection = conn;
            self.connectedState();
        } else if (status === Strophe.Status.DISCONNECTED) {
            self.logConnectTriggerStatus("DISCONNECTED", status);
            self.$el.find("#infoHeader").removeClass("agentConnecting").removeClass("agentOnilne").addClass("agentDisconnected");
            self.chatSDK.connection = conn;
            self.disconnectedState();
        } else if (status === Strophe.Status.CONNECTING) {
            self.logConnectTriggerStatus("CONNECTING", status);
            self.$el.find("#infoHeader").removeClass("agentDisconnected").removeClass("agentOnilne").addClass("agentConnecting");
            self.chatSDK.connection = conn;
            self.connectingState();
        } else if (status === Strophe.Status.AUTHENTICATING) {
            self.logConnectTriggerStatus("AUTHENTICATING", status);
            self.$el.find("#infoHeader").removeClass("agentDisconnected").removeClass("agentOnilne").addClass("agentConnecting");  
            self.chatSDK.connection = conn;
            self.authenticatingState();
        } else if (status === Strophe.Status.DISCONNECTING) {
            self.logConnectTriggerStatus("DISCONNECTING", status);
            self.$el.find("#infoHeader").removeClass("agentDisconnected").removeClass("agentOnilne").addClass("agentConnecting");
            self.chatSDK.connection = conn;
            self.disconnectingState();
        } else if (status === Strophe.Status.CONNFAIL) {
            self.logConnectTriggerStatus("CONNECTION FAILED", status);
            self.$el.find("#infoHeader").removeClass("agentConnecting").removeClass("agentOnilne").addClass("agentDisconnected");
            self.chatSDK.connection = conn;
            self.connectionFailedState();
        } else if (status === Strophe.Status.AUTHFAIL) {
            self.logConnectTriggerStatus("AUTHORIZATION FAILED", status);
            self.$el.find("#infoHeader").removeClass("agentConnecting").removeClass("agentOnilne").addClass("agentDisconnected");
            self.chatSDK.connection = conn;
            self.authFailedState();
        }
    });
    self.chatSDK.connection = conn;
  },

  logConnectTriggerStatus : function(status, statusValue){
    utility.comn.consoleLogger('CONNECT TRIGGER STATUS : ' + status + " StatusValue :" + statusValue);
  },

loadXMLDoc : function(to) {
  var self = this;
  var ping = $iq({to: to,type: "get",id: "ping1"}).c("ping", {xmlns: "urn:xmpp:ping"});
  var postdata1 = {}
  postdata1["session_id"] = LocalCache.sessionid;
  self.chatSDK.sendPingRef=setInterval(function(){
    if(self.chatSDK.reconnectInProgress == "No"){   
      jQuery.ajax({
          url: constants.Url.chatPing,
          type: "POST",          
          chache :false,
          data : postdata1,
          async: true,           
          crossDomain: true,
          wait: true,
          success: function() { 
               if(self.chatSDK.kill=="Yes"){
                   return true;
                }
            self.chatSDK.networkConnection="UP";
            utility.comn.consoleLogger("Network Connected " );
             if(self.chatSDK.connectionStatus === "LOST"){
                  self.updateLoginStatus("Chat server connection lost. Trying to reconnect with Chat server");
                  self.$el.find("#infoHeader").removeClass("agentConnecting").removeClass("agentOnilne").addClass("agentDisconnected");
                  self.chatSDK.reconnectInProgress="Yes";
                  clearInterval(self.chatSDK.pingRef);
                  var reLoadObject = {};
                  reLoadObject['plustxtID']=LocalCache.plustxtid;
                  reLoadObject['passwordID']=LocalCache.password;
                  reLoadObject['sessionID']=LocalCache.sessionid;
                  reLoadObject['tigoID']=LocalCache.tigoid;
                  reLoadObject['loginusername']=LocalCache.loginusername;
                  reLoadObject['displayedWindow']=self.chatSDK.displayedChatDiv;
                  if(self.chatSDK.displayedChatDiv != null ){
                    reLoadObject['jid_id']=self.chatSDK.displayedChatDiv.substring(8);
                    var jid=reLoadObject['jid_id'].replace('-',"@");
                    jid=jid.replace('-',".");
                    reLoadObject['jid']=jid.replace('-',".");
                    reLoadObject['name']=self.chatSDK.nameList[reLoadObject['jid_id']];
                     utility.comn.consoleLogger(reLoadObject['jid']+'  '+reLoadObject['name']+' '+reLoadObject['jid_id'])
                  }
                  $.jStorage.set("reLoadObject", reLoadObject);
                   utility.comn.consoleLogger("Network lost found ");
                  showMessage();
                  setTimeout( function (){
                      hideMessage();
                      clearInterval(self.chatSDK.sendPingRef);
                      self.close();
                      self.render();
                  },1000);      
             }
             else {
                
             }
             if(self.chatSDK.upTime == 0){
                
                var to = Strophe.getDomainFromJid(self.chatSDK.connection.jid);
                var ping = $iq({to: to,type: "get",id: "ping1"}).c("ping", {xmlns: "urn:xmpp:ping"});
               //  utility.comn.consoleLogger('ping message sent+============================================================');
                self.chatSDK.connection.send(ping);
                self.chatSDK.connection.send($pres());  
               
             }
            
             self.chatSDK.upTime =  self.chatSDK.upTime +10;
             self.chatSDK.downTime=0;
      },
      error: function(data1,data2,data3) {
          if(self.chatSDK.kill=="Yes"){
               return true;
           }
           utility.comn.consoleLogger("Network Down");
           self.chatSDK.downTime = self.chatSDK.downTime + 10;
           self.chatSDK.upTime=0;
           self.chatSDK.networkConnection="DOWN"; 
           self.chatSDK.connectionStatus = "LOST";
           self.updateLoginStatus("Chat server connection lost. Trying to reconnect with Chat server");//
           utility.comn.consoleLogger("Chat server connection lost. Trying to reconnect with Chat server");
           self.$el.find("#infoHeader").removeClass("agentConnecting").removeClass("agentOnilne").addClass("agentDisconnected");
        }
        });     
  }
},1500000);
},

  connectedState : function(){
    this.chatSDK.write_to_log("Connected State Handler Called");
    this.chatSDK.kill="No";
    this.updateLoginStatus('Connected');  

    this.chatSDK.connection.addHandler(this.chatSDK.ping_handler, null, "iq", null, "ping1"); 
    this.chatSDK.connection.addHandler(this.chatSDK.ping_handler_readACK, null, "iq", null, "readACK");   
    var domain = Strophe.getDomainFromJid(this.chatSDK.connection.jid);//
    clearInterval(this.chatSDK.sendPingRef);
    //this.loadXMLDoc(domain);
    this.chatSDK.connectionStatus="OK"

    var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
    this.chatSDK.connection.sendIQ(iq, this.chatSDK.on_roster); 
    
    this.chatSDK.write_to_log("IQ for fetching contact information is send : " + iq);
    // Register listeners from roster change and new message
    this.chatSDK.connection.addHandler(this.chatSDK.on_roster_changed, "jabber:iq:roster", "iq", "set");
    this.chatSDK.connection.addHandler(this.chatSDK.on_message, null, "message", "chat");
    var ping = $iq({to: to,type: "get",id: "ping1"}).c("ping", {xmlns: "urn:xmpp:ping"});
    utility.comn.consoleLogger('ping message sent to : ' + to)
    this.chatSDK.connection.send(ping);
  },

  connectingState : function(){
    this.chatSDK.write_to_log("Connecting With XMPP Server");
    this.updateLoginStatus('Connecting with server');
  },

  authenticatingState : function(){
    this.chatSDK.write_to_log("Authenticating with username and password");
    this.updateLoginStatus('Authenticating with username and password');
  },

  disconnectedState : function(){
    this.chatSDK.write_to_log("Disconnected Called");
    this.chatSDK.pending_subscriber = null;
    this.chatSDK.displayedChatDiv = null;
    this.chatSDK.uIExist="No";
    this.chatSDK.connectionStatus = "LOST";
    this.updateLoginStatus('Disconnected');
     if(this.chatSDK){
      this.chatSDK.kill="Yes";
      $.jStorage.deleteKey('reLoadObject');
      clearInterval(this.chatSDK.sendPingRef);
      if(this.chatSDK && this.chatSDK.connection){
       this.chatSDK.connection.disconnect();
      }
      this.chatSDK.connection = null;
      $('#roster-area ul').empty();
      $('#chatListDiv').empty();
      $('#content div').remove();
      this.chatSDK.openedChatDiv = {};
      this.chatSDK.contact_subsription = {};
      this.chatSDK.nameList = {};
      // Clear the cache.
      this.ProgresBar.continueLogin="No";
      //this.clearCachedDatabase(LocalCache.plustxtid);
    }
    if(ChatPanelUser && ChatPanelUser.token ){
      this.connect("", "", $.trim(ChatPanelUser.email), $.trim(ChatPanelUser.email), "91", ChatPanelUser.token);
    }

    // enableOrDisableTabLink();
    // disableProgress();
  },

  disconnectingState : function(){
    this.chatSDK.write_to_log("Disconnecting With XMPP Server");
    this.chatSDK.downTime =30;
    this.updateLoginStatus('Disconnecting with xmpp server');
  },

  authFailedState : function(){
    this.chatSDK.write_to_log("AUTHFAIL for username and password");
    this.updateLoginStatus('Authentication :username and/or password error');
  },

  connectionFailedState : function(){
    this.chatSDK.write_to_log("CONNECTION FAILED With XMPP Server");
    this.chatSDK.connectionStatus="LOST";
    this.chatSDK.reconnectInProgress = "No";
    this.updateLoginStatus('Connection Failed');
  },


  updateLoginStatus : function(inmsg){
    this.$el.find('#loginStatus').text(inmsg);
  },

  updateLoginName: function(inmsg){
   this.$el.find('#loggedUser').text(inmsg);
  },

  getChatSDK : function(){
    var self = this;
    this.chatSDK = {
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
         utility.comn.consoleLogger(message);
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
        self.chatSDK.write_to_log('on_roster called');
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
             utility.comn.consoleLogger('name: ' + Item['name'] + ' jid: ' + jid);
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
},
  
  /*
 * 
 function                : on_Presence_Update_Contact()
 parameters              : JSON object
 parameter description   : This object conatins jid,type of presence stanze ,other additional attribute
 function description       : Used to update presence status of contatc .
 : During authentication entered used name is captured and displayed at the header section
 */
 on_Presence_Update_Contact : function(JsonResponse){
    var from = JsonResponse['jid'];
    var ptype = JsonResponse['type'];
    var show = JsonResponse['show'];
    var jid_id = this.chatSDK.jid_to_id(from);
    // Means that presence message is type subscribe .
    if (ptype === 'subscribe') {
        // populate pending_subscriber, the approve-jid span, and
        // open the dialog box.
        this.chatSDK.write_to_log('on_presence called jid ' + jid_id + ' from ' + from + 'ptype  ' + ptype);
        this.chatSDK.pending_subscriber = from;
        $('#approve-jid').text(Strophe.getBareJidFromJid(from));
        // Checking that wheather this subription originated from this client 
//        if (this.chatSDK.contact_subsription[from] === 1)
//        {
//            //If subscription orignated from this client itself then , replay with subscribed presence 
//            this.chatSDK.connection.send($pres({
//                to: from,
//                "type": "subscribed"}));
//        }
//        else 
//        {
            // if subscription message orginated from other client , replay  subscribed message and 
            // subscription request and new presence information .
            var Result = this.getAllRosters();
            var ans = Result[Strophe.getNodeFromJid(this.chatSDK.pending_subscriber)]
            if(ans != undefined || ans != null){
                     utility.comn.consoleLogger("contact is null .")
                    this.chatSDK.connection.send($pres({to: this.chatSDK.pending_subscriber,"type": "subscribed"}));
                    return ;
            }
            Result = this.addContacts(Strophe.getNodeFromJid(this.chatSDK.pending_subscriber));
            var updateLoginStatusDataObject = {};
            var DataObject = {};
            var jid_id 
            if(Result['status']=== 0){                        
          //     utility.comn.consoleLogger("Information Of new Contact while approv" + JSON.stringify(Result));
              DataObject['jid'] = Result.data['tego_id'] + "@" + constants.Url.chatServerURl;
              //jid_id = this.chatSDK.jid_to_id(DataObject['jid']);
              DataObject['name'] = decode64(Result.data['name']);
            }
            else
                {
                     DataObject['jid']=Strophe.getNodeFromJid(this.chatSDK.pending_subscriber)+ "@" + constants.Url.chatServerURl;
                     DataObject['name']=Strophe.getNodeFromJid(this.chatSDK.pending_subscriber);
                }
            
            /*
             * Setting the new contact information in ejabbered server .
             * Sending subsribed stanze for one side subsription
             * Sending subsription stanze for othe side subsription
             */
            var iq = $iq({type: "set"}).c("query", {xmlns: "jabber:iq:roster"})
                    .c("item", DataObject);
            this.chatSDK.connection.sendIQ(iq);
            this.chatSDK.connection.send($pres({to: this.chatSDK.pending_subscriber,"type": "subscribed"}));
            this.chatSDK.connection.send($pres({to: this.chatSDK.pending_subscriber,"type": "subscribe"}));
            this.chatSDK.connection.send($pres());
            // Adding the contact information to the local cache for storage
            //addContacts(Strophe.getNodeFromJid(this.chatSDK.pending_subscriber));
            this.chatSDK.pending_subscriber = null;
            // Adding namelist Ds for mapping between name and jid_id
             if(Result['status']=== 0){
              this.chatSDK.nameList[jid_id] = decode64(Result.data['name']);
             }
             else {
              this.chatSDK.nameList[jid_id] = "Undefined";
             }

    //}
    }
    // If type is not an error then update the status of contact .
    else if (ptype !== 'error')
    {
        this.chatSDK.write_to_log('on_presence called jid ' + jid_id + ' from ' + from + 'ptype  ' + ptype + '!error called');
        //   alert('jid_id'+jid_id);

        var contact = $('#roster-area li#' + jid_id + ' .roster-contact')
                .removeClass("online")
                .removeClass("away")
                .removeClass("offline");
        $('#ChatListDiv-' + jid_id).removeClass('onlineStatus');
        $('#ChatListDiv-' + jid_id).removeClass('offlineStatus');
        // If type is unavailable the add class online or offlineStatus [UI depended ]
        if (ptype === 'unavailable') {
            // alert('checked-->+unavailable');
            contact.addClass("offline");
            try
            {
             //    utility.comn.consoleLogger('this step worked offlineStatus worked');
                $('#ChatListDiv-' + jid_id).addClass('offlineStatus');
            }
            catch (err) {
            }

        }
        //Presence is online or away .
        else
        {

            //  alert(show);
            if (show === "" || show === "chat") {
                this.chatSDK.write_to_log('on_presence called jid ' + jid_id + ' from ' + from + 'ptype  ' + ptype + '!error called online class added ');
                contact.addClass("online");
                try
                {
                     utility.comn.consoleLogger('this step worked online chat  worked');
                    //Add online class
                    $('#ChatListDiv-' + jid_id).addClass('onlineStatus');
                }
                catch (err) {
                }
            } else {
                this.chatSDK.write_to_log('on_presence called jid ' + jid_id + ' from ' + from + 'ptype  ' + ptype + '!error called away class added');
                contact.addClass("away");
                try
                {
                    //  utility.comn.consoleLogger('this step worked offlineStatus chat  worked');
                    // Add offlineStatus Class
                    $('#ChatListDiv-' + jid_id).addClass('offlineStatus');
                }
                catch (err) {
                }
            }
        }
        try
        {
            var li = contact.parent();
            li.remove();
            // alert(JSON.stringify(li));
            this.chatSDK.insert_contact(li);
        }
        catch (err)
        {
            alert('exception ' + err);
        }
    }
    // reset addressing for user since their presence changed
    var jid_id = this.chatSDK.jid_to_id(from);
    $('#ChatDiv-' + jid_id).data('jid', Strophe.getBareJidFromJid(from));
},

 getAllRosters: function(){
    //  alert('getAllRosters called');
    var plustxtref = "Plustx_" + LocalCache.plustxtid;
    var value = $.jStorage.get(plustxtref, null);
    // alert('getAllRosters called after fetching');
    //  alert('getAllRosters- from chatClient ->'+JSON.stringify(value['contact']));
    return value['contact'];
  },

  /*
 function    : addContacts()
 parameters  : NA
 description : Used to add contatcts.
 : Use User email id  and get Plustxt id from the API.
 : 
 */
 addContacts : function(emailid){
    //Call API and get Tego id and plustxt id of the  the contacts
    var url = constants.Url.chatAddContact +emailid + "/";
    var postdata = {};
    postdata["session_id"] = LocalCache.sessionid;
    postdata = $.param(postdata);
    var Result = this.coreAPI.getAPIResult(url, postdata);
    //Update Local cache - contact details
    //  utility.comn.consoleLogger('checking ' + JSON.stringify(Result));
    //  utility.comn.consoleLogger('new contact adding to localcache ' + Result.data['tego_id']);
    if (Result.status == 0 && Result.data['tego_id'] != undefined)
    {
        /*
         * If User is already registered, then add to the local cache
         * since tego id is not there for unregistered users, no need to add such contacts 
         **/
        LocalCache.addContact(Result, Result.data['email']);
    }
    return Result;
},
  
   setDataToLocalCache: function(contactlist){
    //alert('session id--'+LocalCache.sessionid);
      var url = constants.Url.chatGetAllConversation;
      var postdata = {};
      postdata["session_id"] = LocalCache.sessionid;
      postdata = $.param(postdata);
      LocalCache.getAPIData_StoreLocally(contactlist);
  },

    onChatListClick : function(e){
      var jid = $.trim($(e.currentTarget).find(".hiddenClass").text()); 
      var name = $.trim($(e.currentTarget).find(".userNameDiv").text());
      var jid_id = this.chatSDK.jid_to_id(jid);
      var tigo_id = Strophe.getNodeFromJid(jid);
      // Checking whether the div is already created or not 
      if (this.chatSDK.openedChatDiv[jid_id] === 1)
      {
          // Dispplay div is  created already . Show DisplayDiv 
          // Function for showing the Div
          this.showThisDiv(jid_id);
          //Create timestamp for read time.
          /*
           * When clicking on ChatListDiv means all new message are read. So set timestamp for 
           * read time and sending the message read ack to client(s).          * 
           */

           this.send_Read_Notification(jid, jid_id, tigo_id);
           return false;
      }
      // If ChatListDiv is clicking for first time , the create DisplayDiv and append history from cache .
      this.addChatAreaAndChatList(jid_id, name, jid);
      $('#DisplayDiv-' + jid_id).html('');
      // Append the history .
      this.insert_Message(jid_id, jid, name, tigo_id);
      //move the scroll down to see last message
      this.chatSDK.scroll_chat(jid_id);
    },

  send_Read_Notification : function(jid, jid_id, tigo_id){
    var to = Strophe.getDomainFromJid(this.chatSDK.connection.jid);
    var ping = $iq({to:to,type: "get",id: "readACK"}).c("ping", {xmlns: "urn:xmpp:ping"});
    this.chatSDK.connection.send(ping);
    var informationObj={};
    informationObj['tigoid']=tigo_id;
    informationObj['timeStamp']= this.getTimeInLongString();
    informationObj['jid']=jid;
    informationObj['jid_id']=jid_id;
    this.chatSDK.readACKO.push(informationObj);
  },

    /*
 function                : insert_Message()
 parameters              : jid_id,jid,tigo_id
 parameter description   : jid_id - jabber ID of loggedUser, dot and @ replaced with underscore 
 tigo_id - tigo id the other party
 function  description   : insert the message to chatDiv
 */
 insert_Message : function(jid_id, jid, name, tigo_id, renderHistory) {
    var self = this;
     utility.comn.consoleLogger('insert_Message Called: tigo_id of Customer ' + tigo_id)
    var JsonResponse = this.getConversationForAContact(tigo_id);
    if(renderHistory){
      $('#DisplayDiv-' + jid_id + '.chat-messages').empty();
    }
    
    if (JsonResponse == undefined)
    {
        // There is not message exist for that particular tigo_id
    }
    else {
        //Determine who is the sender and receiver and  call the function accordingly/        
        for (var i = 0; i < JsonResponse.length; i++) {
            var message = JsonResponse[i];
            if (message['sender'] == tigo_id) {
                // message sent by other party
                var JResponse = {};
                JResponse['sender'] = message['sender'];
                JResponse['body'] = message['txt'];
                JResponse['full_jid'] = jid;
                JResponse['composing'] = [];
                JResponse['sent_on'] = message['sent_on'];
                JResponse['state']=message['state'];
                JResponse['mid']=message['mid'];
                
                self.chatByThem(JResponse, name);
            }
            else {
                // message sent by logged User
                JResponse = {};
                JResponse['sender'] = message['sender'];
                JResponse['body'] = message['txt'];
                JResponse['tigo_id'] = tigo_id;
                JResponse['jid_id'] = jid_id;
                JResponse['sent_on'] = message['sent_on'];
                JResponse['state']=message['state'];
                JResponse['mid']=message['mid'];
                self.chatByme(JResponse);
            }
        }
    }
},

    /* 
 function                : on_Message_Update_Chat()
 parameters              : JSON object
 parameter description   : This object conatins jid,composing information ,other additional attribute, message body
 function description    : Used to update the ChatDiv with new message
 : When new message arrives this function will be called and then
 if DisplayDiv and ChatListDiv is not created , then function will create and new 
 DisplayDiv and ChatListDiv and insert history message available from cache.
 Finally append the new message.
 */
  on_Message_Update_Chat : function(JsonResponse) {
    
    var full_jid = JsonResponse['full_jid'];
    var composing = JsonResponse['composing'];
    var body = JsonResponse['body'];
    var messageId = JsonResponse['id'];
    var isProductDetails = false;
    if(JsonResponse['id']){
      isProductDetails = JsonResponse['isProductDetails'];
    }
    var jid = Strophe.getBareJidFromJid(full_jid);
    var jid_id = this.chatSDK.jid_to_id(jid);

    //this.$el.find("#ChatDiv-" + jid_id).show();
    this.$el.find('#ChatListDiv-' + jid_id).next().show();
    this.$el.find('#ChatListDiv-' + jid_id).show();

    this.chatSDK.write_to_log('full_jid ' + full_jid + 'jid ' + jid + 'jid_id ' + jid_id);
    // Checking whether ChatDiv is existing or not 
    if ($('#ChatDiv-' + jid_id).length === 0) {
        // ChatDiv is not existing, So create new one
        this.chatSDK.write_to_log('addChatAreaAndChatList called -> from name list ' + this.chatSDK.nameList[jid_id]);
        // create new chatDiv and ChatListDiv
        var name = "";
        if(this.chatSDK.nameList[jid_id] === undefined){
          this.guestUserId = this.guestUserId + 1;
          name = "Guest User " + this.guestUserId;
          this.chatSDK.nameList[jid_id] = name;
        }
        this.addChatAreaAndChatList(jid_id, name, jid);
       //  utility.comn.consoleLogger(' Tigo Id and Name ' + this.chatSDK.nameList[jid_id] + ' ' + Strophe.getNodeFromJid(jid));
        // append history message 
        this.insert_Message(jid_id, jid, this.chatSDK.nameList[jid_id], Strophe.getNodeFromJid(jid));
    }

    // Checking for composing information.
    //Presenlty this portion is commentef from being executed.
    if (composing.length > 0) {
        // alert('composing length ok DisplayDiv-' + jid_id );
        //  alert( Strophe.getNodeFromJid(jid));
        $('#DisplayDiv-' + jid_id + '.chat-messages').append(
                "<div class='chat-event' style='font-color:green'>" +
                Strophe.getNodeFromJid(jid) +
                " is typing...</div>");
        this.chatSDK.scroll_chat(jid_id);
    }

    var MessID='mid-'+messageId;
    // If body part available.
    if (body) {
        // remove notifications since user is now active
        // Exact the timestamp from messageID
        var timeInMilliSeconds = messageId.substr(messageId.lastIndexOf('-') + 1, messageId.length);
        var messageTimeDescription = this.milliTimeToString(new Number(timeInMilliSeconds));
        // Display new message in ChatDiv
        var state="Delivered";
        $('#DisplayDiv-' + jid_id + ' .chat-event').remove();
        // add the new message
        if(isProductDetails){
          var message = JSON.parse(body);
          if(message.PRDCNTXT){
            var product = message.PRDCNTXT;
            this["bargainProduct-" + jid] = product;
            this.enableChatUser(jid_id);
            var productHtml = '<ul>' +
                '<li><img src="'+ product.image_url +'" alt="" title="" class="chatImage"></li>' +
                  '<li>' +
                    'Item: '+ product.description+'<br>' +
                      '<span class="WebRupee">Rs</span>' + product.price + ' <span class="orange pl10"><b>Discount Cap: '+ '-' +'%</b></span>' +
                  '</li>' +
                  '<li><span style="float:right;font-size:9px">'+messageTimeDescription + '</span><div style="float:right;font-size:9px" id="'+MessID+'">'+state+'&nbsp</div></li>' +
               '</ul>' +
               '<div class="clear"></div>' +
            '</div>'
            $('#DisplayDiv-' + jid_id + '.chat-messages').append('<div class="cust gry-bg padding">' + productHtml);

            $('#productDiv-' + jid_id + '.his-pos').html('<div class="cust mbot0 padding">' +productHtml).find('li:last-child').remove();// just to add mbot0 class
          }
          else if(message.CLSCHAT){
            $('#DisplayDiv-' + jid_id + '.chat-messages').append('<div class="left-conversation">(Customer): '+ this.chatSDK.nameList[jid_id]+' left the conversation</div>');
            this.disableChatUser(jid_id);
          }else if(message.PRMCODE){
            $('#DisplayDiv-' + jid_id).append(
                    "<div class='floatLeft font13 lt-gry1 bold T-pad10  '>"+ LocalCache.loginusername +"</div>" +
                    "<div class='chat-message pull-right reporter bgblue'>" +
                    "<div class='chat-name me'>" +
                    "<span class='chat-text'>" +
                    message.PRMCODE.message + "<br/><b> USE PROMOCODE:  </b>" + message.PRMCODE.promocode + " <b>VALID TILL: </b>" + message.PRMCODE.validity + " <b>Min Qty: </b>" + message.PRMCODE.minQuantity +
                    "</span></div><span style='float:right;font-size:9px'>" + messageTimeDescription + "</span><div style='float:right;font-size:9px' id='"+MessID+"'>"+state+"&nbsp;</div></div><div class='reporter-ico-me'></div><div class='clear'></div>");
          }else{
            this.enableChatUser(jid_id);
            $('#DisplayDiv-' + jid_id + '.chat-messages').append(
                  "<div class='floatRight rt-user font13 lt-gry1 bold T-pad10'>"+ this.chatSDK.nameList[jid_id] +"</div>" +
                  "<div class='chat-message pull-right right-marg20 reporter '>" +
                  "<div class='chat-name'>" +
                  "<span class='chat-text'>" +
                  "</span></div><span style='float:right;font-size:9px'>" + messageTimeDescription + "</span><div style='float:right;font-size:9px' id='"+MessID+"'>"+state+"&nbsp;</div></div><div class='reporter-ico'></div><div class='clear'></div>");
          $('#DisplayDiv-' + jid_id + ' .chat-message:last .chat-text')
                  .append(body);
          }
          
        }
        else{
          this.enableChatUser(jid_id);
          $('#DisplayDiv-' + jid_id + '.chat-messages').append(
                  "<div class='floatRight rt-user font13 lt-gry1 bold T-pad10'>"+ this.chatSDK.nameList[jid_id] +"</div>" +
                  "<div class='chat-message pull-right right-marg20 reporter '>" +
                  "<div class='chat-name'>" +
                  "<span class='chat-text'>" +
                  "</span></div><span style='float:right;font-size:9px'>" + messageTimeDescription + "</span><div style='float:right;font-size:9px' id='"+MessID+"'>"+state+"&nbsp;</div></div><div class='reporter-ico'></div><div class='clear'></div>");
          $('#DisplayDiv-' + jid_id + ' .chat-message:last .chat-text')
                  .append(body);
        }
        var strTimeMii = timeInMilliSeconds.substring(0, 10);
        //add the new message to cache.
        this.sendMessage(LocalCache.plustxtid, jid, body, strTimeMii, messageId);
        // Update the status to delivered .
        LocalCache.updateMessageStatus(messageId, 2, Strophe.getNodeFromJid(jid), getTimeInLongString());
        $('#ChatListDiv-' + jid_id).addClass('newMessageCame');
        // trim the lastMessage field to first 15 characters 
        var messageBody = body;
        if (messageBody.length > 15)
            messageBody = messageBody.substring(0, 14) + '...';
        // update last message information
        $('#ChatListDiv-' + jid_id).children('.lastMessage').html(messageTimeDescription);        
        //move the scroll down to see last message sent
        this.chatSDK.scroll_chat(jid_id);
        
    }
  },

/* 
 function                : chatByThem()
 parameters              : JSON obejct,name 
 parameter description   : JSON object contain chat messages and related information. and name of other party
 function description    : This function used to populate chaytDiv
 : This function is called to populate the ChatDiv with history message which
 sent other party
 
 
 */
chatByThem: function(JsonResponse, name)
{
    var full_jid = JsonResponse['full_jid'];
    var composing = JsonResponse['composing'];
    var mid=JsonResponse['mid']+'000';
    var MessID='mid-'+mid;
    var state;
   
    if(JsonResponse['state'] === 3 ){
       state="Read"; 
    }else if (JsonResponse['state']=== 2){
        state="Delivered"
    }else if (JsonResponse['state']===1){
        state="Sent"
    }else {
        state="Sending";
    }
    
    var body = JsonResponse['body'];
    //Prepare timestamp
    var sent_on = new Number(JsonResponse['sent_on'] + '000');
    var messageTimeDescription = this.milliTimeToString(sent_on);
    var jid = Strophe.getBareJidFromJid(full_jid);
    var jid_id = this.chatSDK.jid_to_id(jid);
    if (body)
    {
        // remove notifications since user is now active
        $('#DisplayDiv-' + jid_id + ' .chat-event').remove();
        // add the new message
        try{
          var message = JSON.parse(body);
           if(message.PRDCNTXT){
            var product = message.PRDCNTXT;
            this["bargainProduct-" + jid] = product;
            var productHtml = '<ul>' +
                '<li><img src="'+ product.image_url +'" alt="" title="" class="chatImage"></li>' +
                  '<li>' +
                    'Item: '+ product.description+'<br>' +
                      '<span class="WebRupee">Rs</span>' + product.price + ' <span class="orange pl10"><b>Discount Cap: '+ '-' +'%</b></span>' +
                  '</li>' +
                  '<li><span style="float:right;font-size:9px">'+messageTimeDescription + '</span><div style="float:right;font-size:9px" id="'+MessID+'">'+state+'&nbsp</div></li>' +
               '</ul>' +
               '<div class="clear"></div>' +
            '</div>'
            $('#DisplayDiv-' + jid_id + '.chat-messages').append('<div class="cust gry-bg padding">' + productHtml);// doing this just to add cust class
            $('#productDiv-' + jid_id + '.his-pos').html('<div class="cust mbot0 padding">' + productHtml).find('li:last-child').remove();
          }
          else if(message.CLSCHAT){
            $('#DisplayDiv-' + jid_id + '.chat-messages').append('<div class="left-conversation">(Customer): '+this.chatSDK.nameList[jid_id]+' left the conversation</div>');
            // this.disableChatUser(jid_id);
          }
          else{
            $('#DisplayDiv-' + jid_id + '.chat-messages').append(
            "<div class='floatRight rt-user font13 lt-gry1 bold T-pad10'>"+ name +"</div>" +
            "<div class='chat-message pull-right right-marg20 reporter'>" +
            "<div class='chat-name'>" +
            "<span class='chat-text'>" +                
            "</span></div><span style='float:right;font-size:9px'>"+messageTimeDescription + "</span><div style='float:right;font-size:9px' id='"+MessID+"'>"+state+"&nbsp</div></div><div class='reporter-ico'></div><div class='clear'></div>");
          $('#DisplayDiv-' + jid_id + ' .chat-message:last .chat-text').append(body);
          }
        }
        catch(e){
          $('#DisplayDiv-' + jid_id + '.chat-messages').append(
            "<div class='floatRight rt-user font13 lt-gry1 bold T-pad10'>"+ name +"</div>" +
            "<div class='chat-message pull-right right-marg20 reporter'>" +
            "<div class='chat-name'>" +
            "<span class='chat-text'>" +                
            "</span></div><span style='float:right;font-size:9px'>"+messageTimeDescription + "</span><div style='float:right;font-size:9px' id='"+MessID+"'>"+state+"&nbsp</div></div><div class='reporter-ico'></div><div class='clear'></div>");
          $('#DisplayDiv-' + jid_id + ' .chat-message:last .chat-text').append(body);
        }
    }
},

/* 
 function                : chatByme()
 parameters              : JSON obejct
 parameter description   : JSON object contain chat messages and related information
 function description    : This function used to populate chaytDiv
 : This function is called to populate the ChatDiv with history message which
 sent logged User
 
 
 */
chatByme : function(JsonResponse)
{
    var body = JsonResponse['body'];
    var jid_id = JsonResponse['jid_id'];
    var tigo_id = JsonResponse['tigo_id'];
    var mid=JsonResponse['mid']+'000';
    var MessID='mid-'+mid;
      var state;
    //   utility.comn.consoleLogger('state is '+JsonResponse['state']+'message '+body);
    if(JsonResponse['state']=== 3 ){
       state="Read"; 
    }else if (JsonResponse['state']=== 2){
        state="Delivered"
    }else if (JsonResponse['state']=== 1){
        state="Sent"
    }else {
        state="Sending";
    }
     // utility.comn.consoleLogger('state is '+JsonResponse['state']+'state selected '+state+'message '+body);
    // prepare timstamp.
    var sent_on = new Number(JsonResponse['sent_on'] + '000');
    // utility.comn.consoleLogger('chatByMe  ' + JsonResponse['sent_on'] + this.milliTimeToString(JsonResponse['sent_on']));
    var loginName = (JsonResponse['sender'] == LocalCache.tigoid) ? LocalCache.loginusername : "Other Agent";
    var messageTimeDescription = this.milliTimeToString(sent_on);
    // append the message
    try{
          var message = JSON.parse(body);
          if(message.CLSCHAT){
            $('#DisplayDiv-' + jid_id + '.chat-messages').append('<div class="left-conversation">(Agent): '+loginName+' left the conversation</div>');
          }else if(message.PRMCODE){
            $('#DisplayDiv-' + jid_id).append(
                "<div class='floatLeft font13 lt-gry1 bold T-pad10  '>"+ loginName +"</div>" +
                "<div class='chat-message pull-right reporter bgblue'>" +
                "<div class='chat-name me'>" +
                "<span class='chat-text'>" +
                message.PRMCODE.message + "<br/><b> USE PROMOCODE:  </b>" + message.PRMCODE.promocode + " <b>VALID TILL: </b>" + message.PRMCODE.validity + " <b>Min Qty: </b>" + message.PRMCODE.minQuantity +
                "</span></div><span style='float:right;font-size:9px'>" + messageTimeDescription + "</span><div style='float:right;font-size:9px' id='"+MessID+"'>"+state+"&nbsp;</div></div><div class='reporter-ico-me'></div><div class='clear'></div>");
          }
          else{
            this.insertNewMesgToDisplayDiv(jid_id, loginName, body, messageTimeDescription,  MessID, state);
          }
    }
    catch(e){
      this.insertNewMesgToDisplayDiv(jid_id, loginName, body, messageTimeDescription,  MessID, state);
    }
},

/*
 function    : getConversationForAContact()
 parameters  : tigo_id_of_other_party
 description : Get All conversation between Login user and other party selected.(tigo_id_of_other_party)
 : 
 */
 getConversationForAContact: function(tigo_id_of_other_party)
{
    var plustxtref = "Plustx_" + LocalCache.plustxtid;
    var value = $.jStorage.get(plustxtref, null);
    // utility.comn.consoleLogger('plustxtref' + "Plustx_" + LocalCache.plustxtid + ' tigo_id of other party ' + tigo_id_of_other_party);

    //alert('getConversationForAContact->'+JSON.stringify(value['message'][tigo_id_of_other_party]));
    //alert('getConversationForAContact->'+JSON.stringify(value['message'][tigo_id_of_other_party]));
    // utility.comn.consoleLogger('getConversationForAContact->' + JSON.stringify(value['message'][tigo_id_of_other_party]));
    var ConversationWithContact = value['message'][tigo_id_of_other_party];
    //alert('Before---'+JSON.stringify(ConversationWithContact));
    //ConversationWithContact ordered by Last_ts but messages should be displayed in the order of sent_on ascending
    var sort_by = function(field, reverse, primer) {
        var key = function(x) {
            return primer ? primer(x[field]) : x[field]
        };
        return function(a, b) {
            var A = key(a), B = key(b);
            return ((A < B) ? -1 : (A > B) ? +1 : 0) * [-1, 1][+!!reverse];
        }
    }
    if (ConversationWithContact === undefined || ConversationWithContact == "" || ConversationWithContact == null) {

    }
    else {
        ConversationWithContact.sort(sort_by('sent_on', true, parseInt));
    }
    //alert('After---'+JSON.stringify(ConversationWithContact));

    return value['message'][tigo_id_of_other_party];
},

addChatAreaAndChatList: function(jid_id, name, jid){
    // this.chatSDK.displayedChatDiv will keep  track of currently displayed ChatDiv.
    // Null means there is no chatDiv displayed yet.
    // Always Assign this variable with displayed ChatDiv
    // 
    if (this.chatSDK.displayedChatDiv !== null)
    {
        document.getElementById(this.chatSDK.displayedChatDiv).className = 'hidden';
    }
    // this.chatSDK.openedChatDiv will keep track of all opened ChatDiv .
    // While creating new chatDiv ,You should add its opendChatDiv array .
    // When user click on particular roster or  left side chat history , we use this
    // array to determine if ChatDiv created Or not 
    this.chatSDK.openedChatDiv[jid_id] = 1;
    this.chatSDK.displayedChatDiv = "ChatDiv-" + jid_id;
    // Checking whether left side panel already created or not 
    if ($('#ChatListDiv-' + jid_id).length > 0) {
        $(".chatListDiv").removeClass('selectedChatWindow');
        $('#ChatListDiv-' + jid_id).addClass('selectedChatWindow');
        // Left side panel already exist with last message 
    }
    // Left Side Panel/History Panel not created So Create the Panel First     
    else {

        // This if else ladder will determine  presence status of roster  
        var Lstate;
        if ($('#' + jid_id).children().hasClass('online'))
            Lstate = "onlineStatus";
        else if ($('#' + jid_id).children().hasClass('away'))
            Lstate = "offlineStatus";
        else if ($('#' + jid_id).children().hasClass('offline'))
            Lstate = "offlineStatus";

        var chatListDiv = document.createElement('ul');
        chatListDiv.setAttribute("id", "ChatListDiv-" + jid_id);
        chatListDiv.className = 'chatListDiv ' + Lstate + ' selectedChatWindow';
        chatListDiv.setAttribute('name', jid);

        var userNameDiv = document.createElement('li');
        userNameDiv.className = 'userNameDiv T-pad10 bold';
        userNameDiv.innerHTML = name;
        userNameDiv.setAttribute('name', jid);
        chatListDiv.appendChild(userNameDiv);

        var labelhidden = document.createElement('li');
        labelhidden.className = 'hiddenClass';
        labelhidden.innerHTML = jid;
        userNameDiv.appendChild(labelhidden);

        var labelL = document.createElement('li');
        labelL.className = 'lastMessage ';
        userNameDiv.appendChild(labelL);

        var clearDiv = document.createElement('div');
        clearDiv.className = 'clear wht-line';
        document.getElementById('chatListDiv').appendChild(chatListDiv);
        document.getElementById('chatListDiv').appendChild(clearDiv);
    }



    // Creating the display message part and input box 
    var chatDiv = document.createElement('div');
    chatDiv.className = 'bookContainer gry-bg T-pad8';
    chatDiv.setAttribute("id", "ChatDiv-" + jid_id);

     var productDiv = document.createElement('div');
    productDiv.className = 'productContainer his-pos';
    productDiv.setAttribute("id", "productDiv-"+jid_id);

    var displayDiv = document.createElement('div');
    displayDiv.className = 'displayDiv chat-messages scroll';
    displayDiv.setAttribute("id", "DisplayDiv-" + jid_id);

    var labelF = document.createElement('div');
    labelF.className = "labelClassT gry-bg"
    labelF.innerHTML = "Customer : " + name;

    var labelHistory = document.createElement('a');
    // labelHistory.className = "chatHistoryFetch"
    labelHistory.innerHTML = "History";
    labelHistory.setAttribute("name", jid);
    labelHistory.setAttribute("id", "a-" + jid_id);
    labelHistory.setAttribute("href", "#");
    labelHistory.setAttribute("class", "L-pad13 chatHistoryFetch font13")


    var labelCloseChat = document.createElement('a');
    labelCloseChat.innerHTML = "Close";
    labelCloseChat.setAttribute("id", "cc-" + jid_id);
    labelCloseChat.setAttribute("href", "#");
    labelCloseChat.setAttribute("class", "closeChat L-pad13 font13");

    var labelPromo = document.createElement('a');
    labelPromo.innerHTML = "Discount";
    labelPromo.setAttribute("id", "promo-" + jid_id);
    labelPromo.setAttribute("href", "#");
    labelPromo.setAttribute("class", "createPromoCode pull-right R-marg15 font13");

    var labelDetail = document.createElement('a');
    labelDetail.innerHTML = "Product Detail";
    labelDetail.setAttribute("id", "detail-" + jid_id);
    labelDetail.setAttribute("href", "#");
    labelDetail.setAttribute("class", "detailProduct pull-right R-marg15 font13");

    //For testing
    var labelEnableUser = document.createElement('a');
    labelEnableUser.innerHTML = "Enable Chat";
    labelEnableUser.setAttribute("id", "enable-" + jid_id);
    labelEnableUser.setAttribute("href", "#");
    labelEnableUser.setAttribute("class", "enableChatWindow pull-right R-marg15 font13 hidden");
    chatDiv.appendChild(labelEnableUser);

    chatDiv.appendChild(labelF);
    chatDiv.appendChild(labelHistory);
    chatDiv.appendChild(labelCloseChat);
    chatDiv.appendChild(labelPromo);
    chatDiv.appendChild(labelDetail);
    chatDiv.appendChild(productDiv);


    var inputDiv = document.createElement('div');
    inputDiv.className = 'inputDiv';


    var inputBox = document.createElement('textarea');
    inputBox.setAttribute("type", "text");
    inputBox.className = 'span6N inputChatBox';
    inputBox.setAttribute('name', jid);
    inputBox.setAttribute("id", "InputBox-" + jid_id);



    var inputBut = document.createElement('input');
    inputBut.setAttribute("type", "button");
    inputBut.setAttribute('name', jid);
    inputBut.setAttribute("id", "InputBut-" + jid_id);
    inputBut.setAttribute("value", "Send");
    inputBut.setAttribute("class", "hidden");
    // var nameVariable = "this.attributes['name'].value";
    // inputBut.setAttribute('onclick', 'sendMessageLive(' + nameVariable + ')');


    var tbl = document.createElement("table");
    tbl.className = "InputDivTable";
    var tblBody = document.createElement("tbody");
    var row = document.createElement("tr");
    var cell = document.createElement("td");
    cell.setAttribute("class", "gry-bar");
    cell.appendChild(inputBox);
    row.appendChild(cell);
    cell = document.createElement("td");
    cell.appendChild(inputBut);
    row.appendChild(cell);
    tblBody.appendChild(row);
    tbl.appendChild(tblBody);
    inputDiv.appendChild(tbl);
    chatDiv.appendChild(displayDiv);
    chatDiv.appendChild(inputDiv);
    // Append the created chatDiv to existing content div 
    document.getElementById('content').appendChild(chatDiv);
},

   showThisDiv: function(jid_id){
    // Removing new message information 
      try {
          $(".chatListDiv").removeClass('selectedChatWindow');
          $('#ChatListDiv-' + jid_id).removeClass('newMessageCame');
          $('#ChatListDiv-' + jid_id).addClass('selectedChatWindow');
      } catch (err) {
      }
      // hidding the currently displayed ChatDiv if available
      if (this.chatSDK.displayedChatDiv !== null) {
          document.getElementById(this.chatSDK.displayedChatDiv).className = 'hidden';
          if(this.$el.find('#' + this.chatSDK.displayedChatDiv).is(":visible")){
            this.$el.find('#' + this.chatSDK.displayedChatDiv).hide();
          }
      }
      // Setting the currently displayed Device id 
      this.chatSDK.displayedChatDiv = "ChatDiv-" + jid_id;
      document.getElementById(this.chatSDK.displayedChatDiv).className = 'bookContainer';
      if(!this.$el.find('#' + this.chatSDK.displayedChatDiv).is(":visible")){
        this.$el.find('#' + this.chatSDK.displayedChatDiv).show();
      }
  },

  onChatInputFocus : function(e){
    var jid = $(e.currentTarget)[0].attributes["name"].value;
    var jid_id = this.chatSDK.jid_to_id(jid);
    $('#ChatListDiv-' + jid_id).removeClass('newMessageCame');
  },

    onChatInputKeypress : function(ev){
        var self = this;
        var jid = $(ev.currentTarget)[0].attributes["name"].value;
        var jid_id = this.chatSDK.jid_to_id(jid);
        $('#ChatListDiv-' + jid_id).removeClass('newMessageCame');
        // Pressed key is enterkey , so send the message to client.
        if (ev.which === 13) {
            ev.preventDefault();
            // creating the body part.
            var body = $.trim($('#InputBox-' + jid_id).val());
            if($.trim(body) != ""){
              this.sendChatMessages(body, jid, jid_id);
            }
        } 
        // else {
        //     var composing = $(this).parent().data('composing');
        //     if (!composing) {
        //     }
        // }
    },

    sendChatMessages: function(body, jid, jid_id){
      utility.comn.consoleLogger('Send Message Called');
      var self = this;
      if(body !== ""){
            var timeInMilliSecond = getTimeInLongString();
            var strTimeMii = timeInMilliSecond.toString();
            var messageId = LocalCache.tigoid + "-c-" + strTimeMii;
            var mid = messageId.toString();
             utility.comn.consoleLogger("Send Message! MessageId: " + mid + " Message: " + body);
            // Building the message stanze.
            var message = $msg({to: jid,
                "type": "chat", "id": mid})
                    .c('body').t(body).up()
                    .c('active', {xmlns: "http://jabber.org/protocol/chatstates"}).up()
                    .c('meta').c('acl', {deleteafter: "-1", canforward: "1", candownload: "1"});
            //Update local cache message contents
             var to = Strophe.getDomainFromJid(self.chatSDK.connection.jid);
             var ping = $iq({to: to,type: "get",id: "ping1"}).c("ping", {xmlns: "urn:xmpp:ping"});
               //  utility.comn.consoleLogger('ping message sent+============================================================');
                self.chatSDK.connection.send(ping);
             utility.comn.consoleLogger('messageId   ' + messageId + ' to ' + jid_id);

            strTimeMii = strTimeMii.substring(0, 10);
            // inserting the message to cache .
            self.sendMessage(jid, LocalCache.plustxtid, body, strTimeMii, mid);
            // Update the status to send 
            var state="Sent ";
            var MessID='mid-'+mid;

                LocalCache.updateMessageStatus(mid, -1, Strophe.getNodeFromJid(jid), timeInMilliSecond); 

            var messageTimeDescription = self.milliTimeToString(timeInMilliSecond);
            try{
              var message = JSON.parse(body);
              if(message.CLSCHAT){
                $('#DisplayDiv-' + jid_id + '.chat-messages').append('<div class="left-conversation">(Agent): '+LocalCache.loginusername+' left the conversation</div>');
              }
              else if(message.PRMCODE){
                $('#DisplayDiv-' + jid_id).append(
                    "<div class='floatLeft font13 lt-gry1 bold T-pad10  '>"+ LocalCache.loginusername +"</div>" +
                    "<div class='chat-message pull-right reporter bgblue'>" +
                    "<div class='chat-name me'>" +
                    "<span class='chat-text'>" +
                    message.PRMCODE.message + "<br/><b> USE PROMOCODE:  </b>" + message.PRMCODE.promocode + " <b>VALID TILL: </b>" + message.PRMCODE.validity + " <b>Min Qty: </b>" + message.PRMCODE.minQuantity +
                    "</span></div><span style='float:right;font-size:9px'>" + messageTimeDescription + "</span><div style='float:right;font-size:9px' id='"+MessID+"'>"+state+"&nbsp;</div></div><div class='reporter-ico-me'></div><div class='clear'></div>");
              }
              else{
                self.insertNewMesgToDisplayDiv(jid_id, LocalCache.loginusername, body, messageTimeDescription,  MessID, state);
              }
            }
            catch(e){
              self.insertNewMesgToDisplayDiv(jid_id, LocalCache.loginusername, body, messageTimeDescription,  MessID, state);
            }
            //move the scroll down to see last message sent
            self.chatSDK.scroll_chat(jid_id);

            $('#InputBox-' + jid_id).val('');
            var tigo_id = Strophe.getNodeFromJid(jid);
            self.send_Read_Notification(jid, jid_id, tigo_id);
          }

    },

    insertNewMesgToDisplayDiv : function(jid_id, loginName, body, messageTimeDescription,  MessID, state){

       $('#DisplayDiv-' + jid_id).append(
                    "<div class='floatLeft font13 lt-gry1 bold T-pad10  '>"+ loginName +"</div>" +
                    "<div class='chat-message pull-right reporter bgblue'>" +
                    "<div class='chat-name me'>" +
                    "<span class='chat-text'>" +
                    body +
                    "</span></div><span style='float:right;font-size:9px'>" + messageTimeDescription + "</span><div style='float:right;font-size:9px' id='"+MessID+"'>"+state+"&nbsp;</div></div><div class='reporter-ico-me'></div><div class='clear'></div>");
    },
            //move the scroll down to see last message sent
    
 
//      this.reLoginOrNormalFunction();      
// },

  /* 
 function                : on_roster_Get_Contact()
 parameters              : JSON obejct
 parameter description   : JSON object contain information regarding to each contact.
 function description    : This function used to populate roster-area with contact.
 : This functin will be called when new contact becomes availale.
 */
 on_roster_Get_Contact: function(JsonResponse) {
    var con;
    // utility.comn.consoleLogger(' on_roster_Get_Contact(JsonResponse)' + JSON.stringify(JsonResponse))
    //  alert(JSON.stringify(JsonResponse));
    for (con in JsonResponse)
    {

        var jid = JsonResponse[con]['plustxtid'];
        var name = JsonResponse[con]['name'];
        var username = JsonResponse[con]['username'];
        this.chatSDK.write_to_log('on_roster items ' + jid + ' ' + name);
        // transform jid into an id
        var jid_id = this.chatSDK.jid_to_id(jid);
        // Prepare nameList DS for name and jid_id mapping 
        this.chatSDK.nameList[jid_id] = name;
        var contact = $("<li id='" + jid_id + "'>" +
                "<div class='roster-contact offline'>" +
                "<div class='tigo-id hiddenClass'>" +
                Strophe.getNodeFromJid(jid) +
                "</div><div class='roster-name'>" +
                name +
                "</div><div class='roster-jid hiddenClass2'>" +
                jid +
                "</div><div class='username'>" +
                username +
                "</div></div></li>");
        this.chatSDK.insert_contact(contact);
    }
},

  /*
 *Function      : on_roster_Create_ChatDiv()
 *Brief             : Used to create the ChatListDiv
 *Detail        : 
 *Input param       : JSON object
 *Output param      : -
 *Return            : -
 */
on_roster_Create_ChatDiv: function(JsonResponse)
{ 
    var con;
    var history = this.getHistory();
    for (con in JsonResponse)
    {

        var jid = JsonResponse[con]['plustxtid'];
        var name = JsonResponse[con]['name'];
        this.chatSDK.write_to_log('on_roster items ' + jid + ' ' + name);
        // transform jid into an id
        var jid_id = this.chatSDK.jid_to_id(jid);
        var tego_id = Strophe.getNodeFromJid(jid);
        try
        {
            if (history[tego_id]['last_message'] == undefined || history[tego_id]['last_message'] == "" || history[tego_id]['last_message'] == null)
            {

            }
            else
            {
                this.chatSDK.nameList[jid_id] = name;
                var Lstate;
                if ($('#' + jid_id).children().hasClass('online'))
                    Lstate = "onlineStatus";
                else if ($('#' + jid_id).children().hasClass('away'))
                    Lstate = "offlineStatus";
                else if ($('#' + jid_id).children().hasClass('offline'))
                    Lstate = "offlineStatus";
                var chatListDiv = document.createElement('ul');
                chatListDiv.setAttribute("id", "ChatListDiv-" + jid_id);
                chatListDiv.className = 'chatListDiv ' + Lstate ;
                chatListDiv.setAttribute('name', jid);
                
                var userNameDiv = document.createElement('li');
                userNameDiv.className = 'userNameDiv T-pad10 bold'
                userNameDiv.innerHTML = name;
                userNameDiv.setAttribute('name', jid);
                chatListDiv.appendChild(userNameDiv);
                // utility.comn.consoleLogger('here 2');
                var labelhidden = document.createElement('li');
                labelhidden.className = 'hiddenClass lt-gry';
                labelhidden.innerHTML = jid;
                var labelL = document.createElement('li');
                labelL.className = 'lastMessage lt-gry';
                try {
                    var messageBody = utility.comn.parseDate(moment.unix(history[tego_id]['time_stamp'])._d) +  " "  + utility.comn.parseTime(moment.unix(history[tego_id]['time_stamp'])._d);

                    labelL.innerHTML = messageBody;
                }
                catch (err) {
                }

                chatListDiv.appendChild(labelhidden);
                chatListDiv.appendChild(labelL);

                var clearDiv = document.createElement('div');
                clearDiv.className = 'clear wht-line';
                document.getElementById('chatListDiv').appendChild(chatListDiv);
                document.getElementById('chatListDiv').appendChild(clearDiv);
            }
        }
        catch (err) {
        }
    }
},

  getTimeInLongString: function(){
    return new Date().getTime();
  },

  sendMessage : function(inreceiverjid, insenderjid, inmessage, inTime, mid){
    LocalCache.addMessage(inreceiverjid, insenderjid, inmessage, inTime, mid);
  },

  reLoginOrNormalFunction: function(){
    this.chatSDK.reLoad = $.jStorage.get("reLoadObject", null);
     utility.comn.consoleLogger('reLoginOrNormalFunction functiion called');
     if (this.chatSDK.reLoad === null)
          {
            utility.comn.consoleLogger('reLoad Object is null ');
          }
      else {
           showProgress();
          utility.comn.consoleLogger('reLoad Object is not  null ');
          LocalCache.sessionid = this.chatSDK.reLoad['sessionID'];
          LocalCache.password = this.chatSDK.reLoad['passwordID'];
          LocalCache.loginusername = this.chatSDK.reLoad['loginusername'];
          LocalCache.plustxtid = this.chatSDK.reLoad['plustxtID'];
          LocalCache.tigoid = this.chatSDK.reLoad['tigoID'];
          this.updateLoginName(this.chatSDK.reLoad['loginusername']);
           utility.comn.consoleLogger(LocalCache.sessionid+'--'+LocalCache.password+'--'+LocalCache.loginusername+'--'+ LocalCache.plustxtid+'--'+LocalCache.tigoid);
          this.myConnectXMPP();
         //  utility.comn.consoleLogger('working here also');
      }
  },


 myConnectXMPP : function(){
     utility.comn.consoleLogger("myConnectXMPP called");
      utility.comn.consoleLogger(LocalCache.sessionid+'--'+LocalCache.password+'--'+LocalCache.loginusername+'--'+ LocalCache.plustxtid+'--'+LocalCache.tigoid);
     //$(document).trigger('connect', { jid: LocalCache.plustxtid,password: LocalCache.password + LocalCache.tigoid.substring(0, 3) });
},

/*
 function    : getHistory()
 parameters  : NA
 description : Get history for login user
 : 
 */
getHistory : function(){
    var plustxtref = "Plustx_" + LocalCache.plustxtid;
    var value = $.jStorage.get(plustxtref, null);
    return value['history'];
},

 

milliTimeToString : function(inMilliSeconds) {
    var date = new Date(inMilliSeconds);
    var strTime = utility.comn.parseDate(date) + " "+ utility.comn.parseTime(date);
    return strTime;
},


getCoreAPI : function(){
  var self = this;
  this.coreAPI = {
    jsonresult:null,     
    getAPIResult:function(inurl,inpostdata)
    {
        //alert('called');
      self.chatSDK.jqueryStore= jQuery.ajax({
            url:inurl,
            type: "POST",
            data: inpostdata,
            chache :false,
            async: false,
            //
            dataType: "json",
            crossDomain: true,

            //------------------------No need to include--- 
            //headers: {
            //    'User-Agent': 'Plustxt-web'
            //},
            //contentType: "text/html",
            //----------------------------------------------
            wait: true,
            success: function(data) {
               
                self.coreAPI.jsonresult=data;
                
              //  alert(' sucess from getAPI'+data);
            },
            complete: function (xhr, status) {
                if (status === 'error' || !xhr.responseText) {
                 //   alert('complete called'+xhr.responseText+'status' + status);
                }
                else {
                    var data =JSON.stringify(xhr.responseText);    
                    JSON.stringify(data);
                }
            },
            error: function(data1,data2,data3) {
                //alert('in error1->'+JSON.stringify(data1.responseText)+ 'data1.status'+data1.status + ' message'+data1.message);
                //alert('in error2->'+JSON.stringify(data2));
                //alert('in error2->'+JSON.stringify(data3));
                var obj={};
                obj['status']=1;
                obj['message']='Response Code '+data1.status+ ' Internal Server Error';
                self.coreAPI.jsonresult=obj;
               // alert(' error  from getAPI');
            //   utility.comn.consoleLogger(" error returned" + JSON.stringify(data));
            }
        }); 
       // alert('json result from getresult ' + coreAPI.jsonresult);
        return self.coreAPI.jsonresult;
    }
};
}

});