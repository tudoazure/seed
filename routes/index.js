"use strict";
var oauth = require('./lib/oauth');
var oauthcfg = require('./environment').oauth;

module.exports = function(app) {
	
  require('market-oauth').configure(oauthcfg);
  require('./chat')(app);
  app.get('/authorize', oauth.authorize);
  app.get('/token', oauth.getToken, oauth.authorizeMerchant);
  app.get('/logout', oauth.logout);
  app.get('/adminlogout', oauth.logout);

};
