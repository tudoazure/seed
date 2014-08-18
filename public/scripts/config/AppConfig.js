var Globals = {
  AppConfig : {}
};
(function() {
  var chatHostBaseURI = chatHost;
  var fulfillmentBaseURI  = fulfillmentHost;
  var webUri = webUrl;
  Globals.AppConfig = {
  	ConcurrentChats : 3,
  	ChatHostURI : chatHostBaseURI,
    ChatServerConnect : "https://" + chatHostBaseURI + "/accounts/connect/",
    MessageTemplates : "https://" + chatHostBaseURI + "/one97/get-template-messages/",
    StropheConnect : "https://" + chatHostBaseURI  + "/http-bind/",
    PromoCodeCreate : fulfillmentBaseURI + "admin/promocode/bargain",
    DefaultPromoCodeValidity : 3,
    logoutUrl : webUri + "/logout"
  }        
})();
