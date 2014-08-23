var Globals = {
  AppConfig : {}
};
(function() {
  var chatHostBaseURI = chatHost;
  var fulfillmentBaseURI  = fulfillmentHost;
  var webUri = webHost;
  var catalogUri = catalogHost;
  Globals.AppConfig = {
  	ConcurrentChats : 3,
  	ChatHostURI : chatHostBaseURI,
    ChatServerConnect : "https://" + chatHostBaseURI + "/accounts/connect/",
    MessageTemplates : "https://" + chatHostBaseURI + "/one97/get-template-messages/",
    ChatStartedUrl : "https://" + chatHostBaseURI + "/one97/chat-started/",
    ChatClosedUrl : "https://" + chatHostBaseURI + "/one97/chat-closed/",
    StropheConnect : "https://" + chatHostBaseURI  + "/http-bind/",
    AgentPingBack : "https://" + chatHostBaseURI  + "/one97/agent-pingback/",
    PromoCodeCreate : fulfillmentBaseURI + "admin/promocode/bargain",
    DefaultPromoCodeValidity : 3,
    productUrl : catalogUri + "/v1/mobile/product/",
    logoutUrl : webUri + "/logout",
    CloseChatMessage : '{"CLSCHAT" : "chat closed"}'
  }        
})();
