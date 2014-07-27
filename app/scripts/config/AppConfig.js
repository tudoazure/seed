var Globals = {
  AppConfig : {}
};
(function() {
  var chatHostBaseURI = chatHost;
  var fulfillmentBaseURI  = fulfillmentHost;
  Globals.AppConfig = {
  	ChatHostURI : chatHostBaseURI,
    ChatServerConnect : "https://" + chatHostBaseURI + "/accounts/connect/",
    StropheConnect : "https://" + chatHostBaseURI  + "/http-bind/",
  }        
})();
