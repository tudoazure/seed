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
    DefaultPromoCodeValidityDays : 3,
    DefaultHistoryFetchDays : 7,
  	ChatHostURI : chatHostBaseURI.replace(/.*?:\/\//g, ""),
    ChatServerConnect :  chatHostBaseURI + "/accounts/connect/",
    MessageTemplates : chatHostBaseURI + "/one97/get-template-messages/",
    LogoutRequest : chatHostBaseURI + "/one97/agent-logoff-request/",
    GetUserHistory : chatHostBaseURI + "/messages/get-thread-messages/",
    GetFlashMessage : chatHostBaseURI + "/one97/get-flash-message/",
    ChatStartedUrl : chatHostBaseURI + "/one97/chat-started/",
    ChatClosedUrl : chatHostBaseURI + "/one97/chat-closed/",
    StropheConnect : chatHostBaseURI  + "/http-bind/",
    AgentPingBack : chatHostBaseURI  + "/one97/agent-pingback/",
    PromoCodeCreate : fulfillmentBaseURI + "admin/promocode/bargain",
    productUrl : catalogUri + "/v1/mobile/product/",
    logoutUrl : webUri + "/logout",
    CloseChatMessage : '{"CLSCHAT" : "chat closed"}',
    FlashMessageCallTime : 60000,
    FlashMessageVisibility : 6000000,
    AgentPingbackCallTime : 60000
  }        
})();
