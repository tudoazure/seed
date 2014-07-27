var Globals = {
  AppConfig : {}
};
(function() {
  var chatHostBaseURI = chatHost;
  var fulfillmentBaseURI  = fulfillmentHost;
  Globals.AppConfig = {
    ChatServerConnect : chatHostBaseURI + "accounts/connect/"
  }        
})();
