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
  	ChatHostURI : chatHostBaseURI.replace(/.*?:\/\//g, ""),
    ChatServerConnect :  chatHostBaseURI + "/accounts/connect/",
    MessageTemplates : chatHostBaseURI + "/one97/get-template-messages/",
    ChatStartedUrl : chatHostBaseURI + "/one97/chat-started/",
    ChatClosedUrl : chatHostBaseURI + "/one97/chat-closed/",
    StropheConnect : chatHostBaseURI  + "/http-bind/",
    AgentPingBack : chatHostBaseURI  + "/one97/agent-pingback/",
    PromoCodeCreate : fulfillmentBaseURI + "admin/promocode/bargain",
    DefaultPromoCodeValidity : 3,
    productUrl : catalogUri + "/v1/mobile/product/",
    logoutUrl : webUri + "/logout",
    CloseChatMessage : '{"CLSCHAT" : "chat closed"}'
  }        
})();
